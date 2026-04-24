import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsRepository } from './transactions.repository';
import { PrismaService } from '../prisma.service';
import { NotFoundException } from '@nestjs/common';
import { OneAccountTransactionDto, TwoAccountsTransactionDto } from './dto/execute-transaction.dto';

describe('TransactionsRepository', () => {
  let repository: TransactionsRepository;
  let prismaService: PrismaService;

  const mockAccount = {
    id: 1,
    geneid: 'ABC12345',
    accountNo: 'ACC123',
    balance: 100.50,
    owner: 'johndoe',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTransaction = {
    id: 1,
    txprocess: 'D',
    amount: 50.25,
    accountGenId: 'ABC12345',
    doneAt: new Date(),
    transferTo: null,
  };

  const mockPrismaService = {
    account: {
      findMany: jest.fn(),
    },
    transaction: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<TransactionsRepository>(TransactionsRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('getAllTransactions', () => {
    it('should return all transactions for a user when accounts exist', async () => {
      const username = 'johndoe';
      mockPrismaService.account.findMany.mockResolvedValue([mockAccount]);
      mockPrismaService.transaction.findMany.mockResolvedValue([mockTransaction]);

      const result = await repository.getAllTransactions(username);

      expect(prismaService.account.findMany).toHaveBeenCalledWith({
        where: {
          owner: username
        }
      });
      expect(prismaService.transaction.findMany).toHaveBeenCalledWith({
        where: {
          accountGenId: {
            in: [mockAccount.geneid]
          }
        }
      });
      expect(result).toEqual([mockTransaction]);
    });

    it('should return empty array when user has no transactions', async () => {
      const username = 'newuser';
      mockPrismaService.account.findMany.mockResolvedValue([mockAccount]);
      mockPrismaService.transaction.findMany.mockResolvedValue([]);

      const result = await repository.getAllTransactions(username);

      expect(prismaService.account.findMany).toHaveBeenCalledWith({
        where: {
          owner: username
        }
      });
      expect(prismaService.transaction.findMany).toHaveBeenCalledWith({
        where: {
          accountGenId: {
            in: [mockAccount.geneid]
          }
        }
      });
      expect(result).toEqual([]);
    });

    it('should handle multiple accounts for a user', async () => {
      const username = 'multiuser';
      const mockAccount2 = { ...mockAccount, geneid: 'XYZ67890', id: 2 };
      mockPrismaService.account.findMany.mockResolvedValue([mockAccount, mockAccount2]);
      mockPrismaService.transaction.findMany.mockResolvedValue([mockTransaction]);

      const result = await repository.getAllTransactions(username);

      expect(prismaService.account.findMany).toHaveBeenCalledWith({
        where: {
          owner: username
        }
      });
      expect(prismaService.transaction.findMany).toHaveBeenCalledWith({
        where: {
          accountGenId: {
            in: [mockAccount.geneid, mockAccount2.geneid]
          }
        }
      });
      expect(result).toEqual([mockTransaction]);
    });

    it('should throw NotFoundException when user has no accounts', async () => {
      const username = 'noaccountuser';
      mockPrismaService.account.findMany.mockResolvedValue([]);

      await expect(repository.getAllTransactions(username)).rejects.toThrow(NotFoundException);
      expect(prismaService.account.findMany).toHaveBeenCalledWith({
        where: {
          owner: username
        }
      });
      expect(prismaService.transaction.findMany).not.toHaveBeenCalled();
    });
  });

  describe('getTransactionById', () => {
    it('should return transaction when found', async () => {
      const transactionId = 1;
      mockPrismaService.transaction.findUnique.mockResolvedValue(mockTransaction);

      const result = await repository.getTransactionById(transactionId);

      expect(prismaService.transaction.findUnique).toHaveBeenCalledWith({
        where: {
          id: transactionId
        }
      });
      expect(result).toEqual(mockTransaction);
    });

    it('should return null when transaction not found', async () => {
      const transactionId = 999;
      mockPrismaService.transaction.findUnique.mockResolvedValue(null);

      const result = await repository.getTransactionById(transactionId);

      expect(prismaService.transaction.findUnique).toHaveBeenCalledWith({
        where: {
          id: transactionId
        }
      });
      expect(result).toBeNull();
    });
  });

  describe('deposit', () => {
    it('should create a deposit transaction record', async () => {
      const depositDto: OneAccountTransactionDto = {
        amount: 50.25,
        account: 'ABC12345',
      };

      const expectedTransaction = {
        id: 1,
        txprocess: 'D',
        amount: depositDto.amount,
        accountGenId: depositDto.account,
        doneAt: new Date(),
        transferTo: null,
      };

      mockPrismaService.transaction.create.mockResolvedValue(expectedTransaction);

      const result = await repository.deposit(depositDto);

      expect(prismaService.transaction.create).toHaveBeenCalledWith({
        data: {
          txprocess: 'D',
          amount: depositDto.amount,
          accountGenId: depositDto.account,
          doneAt: expect.any(Date),
        }
      });
      expect(result).toEqual(expectedTransaction);
    });
  });

  describe('withdraw', () => {
    it('should create a withdrawal transaction record', async () => {
      const withdrawDto: OneAccountTransactionDto = {
        amount: 25.50,
        account: 'ABC12345',
      };

      const expectedTransaction = {
        ...mockTransaction,
        txprocess: 'W',
        amount: withdrawDto.amount,
        accountGenId: withdrawDto.account,
        doneAt: new Date(),
      };

      mockPrismaService.transaction.create.mockResolvedValue(expectedTransaction);

      const result = await repository.withdraw(withdrawDto);

      expect(prismaService.transaction.create).toHaveBeenCalledWith({
        data: {
          txprocess: 'W',
          amount: withdrawDto.amount,
          accountGenId: withdrawDto.account,
          doneAt: expect.any(Date),
        }
      });
      expect(result).toEqual(expectedTransaction);
    });
  });

  describe('transfer', () => {
    it('should create a transfer transaction record', async () => {
      const transferDto: TwoAccountsTransactionDto = {
        amount: 75.00,
        account: 'ABC12345',
        transferTo: 'XYZ67890',
      };

      const expectedTransaction = {
        ...mockTransaction,
        txprocess: 'T',
        amount: transferDto.amount,
        accountGenId: transferDto.account,
        doneAt: new Date(),
        transferTo: transferDto.transferTo,
      };

      mockPrismaService.transaction.create.mockResolvedValue(expectedTransaction);

      const result = await repository.transfer(transferDto);

      expect(prismaService.transaction.create).toHaveBeenCalledWith({
        data: {
          txprocess: 'T',
          amount: transferDto.amount,
          accountGenId: transferDto.account,
          doneAt: expect.any(Date),
          transferTo: transferDto.transferTo,
        }
      });
      expect(result).toEqual(expectedTransaction);
    });
  });
});
