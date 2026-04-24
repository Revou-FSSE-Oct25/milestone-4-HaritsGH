import { Test, TestingModule } from '@nestjs/testing';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { UpdateAccountDto } from './dto/update-accounts.dto';

describe('AccountsController', () => {
  let controller: AccountsController;
  let accountsService: AccountsService;

  const mockAccount = {
    id: 1,
    accountNo: 'ABC12345',
    balance: 100.50,
    owner: 'johndoe',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAccountsService = {
    create: jest.fn().mockResolvedValue({
      message: 'Account created successfully',
      data: mockAccount,
    }),
    findAll: jest.fn().mockResolvedValue({
      message: 'All accounts retrieved.',
      data: [mockAccount],
    }),
    findOne: jest.fn().mockResolvedValue({
      message: 'Account retrieved.',
      data: mockAccount,
    }),
    update: jest.fn().mockResolvedValue({
      message: 'Account updated.',
      data: { ...mockAccount, balance: 150.75 },
    }),
    remove: jest.fn().mockResolvedValue({
      message: 'Account deleted.',
      data: mockAccount,
    }),
  };

  const mockRequest = {
    user: {
      username: 'johndoe',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [
        {
          provide: AccountsService,
          useValue: mockAccountsService,
        },
      ],
    }).compile();

    controller = module.get<AccountsController>(AccountsController);
    accountsService = module.get<AccountsService>(AccountsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /accounts', () => {
    it('should create a new account successfully', async () => {
      const result = await controller.create(mockRequest);

      expect(accountsService.create).toHaveBeenCalledWith(mockRequest.user.username);
      expect(result).toEqual({
        message: 'Account created successfully',
        data: mockAccount,
      });
    });

    it('should handle account creation errors', async () => {
      const error = new Error('Failed to create account');
      mockAccountsService.create.mockRejectedValueOnce(error);

      await expect(controller.create(mockRequest)).rejects.toThrow('Failed to create account');
      expect(accountsService.create).toHaveBeenCalledWith(mockRequest.user.username);
    });
  });

  describe('GET /accounts', () => {
    it('should get all accounts of logged in user successfully', async () => {
      const result = await controller.findAll(mockRequest);

      expect(accountsService.findAll).toHaveBeenCalledWith(mockRequest.user.username);
      expect(result).toEqual({
        message: 'All accounts retrieved.',
        data: [mockAccount],
      });
    });

    it('should handle get all accounts errors', async () => {
      const error = new Error('Failed to retrieve accounts');
      mockAccountsService.findAll.mockRejectedValueOnce(error);

      await expect(controller.findAll(mockRequest)).rejects.toThrow('Failed to retrieve accounts');
      expect(accountsService.findAll).toHaveBeenCalledWith(mockRequest.user.username);
    });
  });

  describe('GET /accounts/:id', () => {
    it('should get account by id successfully', async () => {
      const accountId = 1;
      const result = await controller.findOne(accountId);

      expect(accountsService.findOne).toHaveBeenCalledWith(accountId);
      expect(result).toEqual({
        message: 'Account retrieved.',
        data: mockAccount,
      });
    });

    it('should handle get account by id errors', async () => {
      const accountId = 999;
      const error = new Error('Account not found');
      mockAccountsService.findOne.mockRejectedValueOnce(error);

      await expect(controller.findOne(accountId)).rejects.toThrow('Account not found');
      expect(accountsService.findOne).toHaveBeenCalledWith(accountId);
    });
  });

  describe('PATCH /accounts/:id', () => {
    it('should update account balance successfully', async () => {
      const accountId = 1;
      const updateDto: UpdateAccountDto = {
        amount: 150.75,
      };

      const result = await controller.update(accountId, updateDto);

      expect(accountsService.update).toHaveBeenCalledWith(accountId, updateDto.amount);
      expect(result).toEqual({
        message: 'Account updated.',
        data: { ...mockAccount, balance: 150.75 },
      });
    });

    it('should handle update account errors', async () => {
      const accountId = 999;
      const updateDto: UpdateAccountDto = {
        amount: 200.00,
      };

      const error = new Error('Account not found');
      mockAccountsService.update.mockRejectedValueOnce(error);

      await expect(controller.update(accountId, updateDto)).rejects.toThrow('Account not found');
      expect(accountsService.update).toHaveBeenCalledWith(accountId, updateDto.amount);
    });
  });

  describe('DELETE /accounts/:id', () => {
    it('should delete account by id successfully', async () => {
      const accountId = 1;
      const result = await controller.remove(accountId);

      expect(accountsService.remove).toHaveBeenCalledWith(accountId);
      expect(result).toEqual({
        message: 'Account deleted.',
        data: mockAccount,
      });
    });

    it('should handle delete account errors', async () => {
      const accountId = 999;
      const error = new Error('Account not found');
      mockAccountsService.remove.mockRejectedValueOnce(error);

      await expect(controller.remove(accountId)).rejects.toThrow('Account not found');
      expect(accountsService.remove).toHaveBeenCalledWith(accountId);
    });
  });
});
