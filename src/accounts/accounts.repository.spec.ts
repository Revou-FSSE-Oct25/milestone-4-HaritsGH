import { Test, TestingModule } from '@nestjs/testing';
import { AccountsRepository } from './accounts.repository';
import { PrismaService } from '../prisma.service';

describe('AccountsRepository', () => {
  let repository: AccountsRepository;
  let prismaService: PrismaService;

  const mockAccount = {
    id: 1,
    accountNo: 'ABC12345',
    balance: 100.50,
    owner: 'johndoe',
    geneid: 'abc12345',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    account: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<AccountsRepository>(AccountsRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAll', () => {
    it('should query accounts by owner with correct filter', async () => {
      const owner = 'johndoe';
      const expectedAccounts = [mockAccount];
      
      mockPrismaService.account.findMany.mockResolvedValue(expectedAccounts);

      const result = await repository.findAll(owner);

      expect(prismaService.account.findMany).toHaveBeenCalledWith({
        where: {
          owner,
        },
      });
      expect(result).toEqual(expectedAccounts);
    });

    it('should return empty array when no accounts found for owner', async () => {
      const owner = 'nonexistent';
      
      mockPrismaService.account.findMany.mockResolvedValue([]);

      const result = await repository.findAll(owner);

      expect(prismaService.account.findMany).toHaveBeenCalledWith({
        where: {
          owner,
        },
      });
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should query account by id correctly', async () => {
      const accountId = 1;
      
      mockPrismaService.account.findUnique.mockResolvedValue(mockAccount);

      const result = await repository.findOne(accountId);

      expect(prismaService.account.findUnique).toHaveBeenCalledWith({
        where: {
          id: accountId,
        },
      });
      expect(result).toEqual(mockAccount);
    });

    it('should return null when account not found by id', async () => {
      const accountId = 999;
      
      mockPrismaService.account.findUnique.mockResolvedValue(null);

      const result = await repository.findOne(accountId);

      expect(prismaService.account.findUnique).toHaveBeenCalledWith({
        where: {
          id: accountId,
        },
      });
      expect(result).toBeNull();
    });
  });

  describe('FindOneByGeneId', () => {
    it('should query account by geneid correctly', async () => {
      const geneid = 'abc12345';
      
      mockPrismaService.account.findUnique.mockResolvedValue(mockAccount);

      const result = await repository.FindOneByGeneId(geneid);

      expect(prismaService.account.findUnique).toHaveBeenCalledWith({
        where: {
          geneid,
        },
      });
      expect(result).toEqual(mockAccount);
    });

    it('should return null when account not found by geneid', async () => {
      const geneid = 'nonexistent';
      
      mockPrismaService.account.findUnique.mockResolvedValue(null);

      const result = await repository.FindOneByGeneId(geneid);

      expect(prismaService.account.findUnique).toHaveBeenCalledWith({
        where: {
          geneid,
        },
      });
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create account with correct data structure', async () => {
      const owner = 'johndoe';
      const geneid = 'abc12345';
      const newAccount = { ...mockAccount, owner, geneid };
      
      mockPrismaService.account.create.mockResolvedValue(newAccount);

      const result = await repository.create(owner, geneid);

      expect(prismaService.account.create).toHaveBeenCalledWith({
        data: {
          owner,
          geneid,
        },
      });
      expect(result).toEqual(newAccount);
    });
  });

  describe('update', () => {
    it('should update account balance by id correctly', async () => {
      const accountId = 1;
      const newBalance = 150.75;
      const updatedAccount = { ...mockAccount, balance: newBalance };
      
      mockPrismaService.account.update.mockResolvedValue(updatedAccount);

      const result = await repository.update(accountId, newBalance);

      expect(prismaService.account.update).toHaveBeenCalledWith({
        where: {
          id: accountId,
        },
        data: {
          balance: newBalance,
        },
      });
      expect(result).toEqual(updatedAccount);
    });
  });

  describe('remove', () => {
    it('should delete account by id correctly', async () => {
      const accountId = 1;
      
      mockPrismaService.account.delete.mockResolvedValue(mockAccount);

      const result = await repository.remove(accountId);

      expect(prismaService.account.delete).toHaveBeenCalledWith({
        where: {
          id: accountId,
        },
      });
      expect(result).toEqual(mockAccount);
    });
  });
});
