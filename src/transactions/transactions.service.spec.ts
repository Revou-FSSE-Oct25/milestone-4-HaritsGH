import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { TransactionsRepository } from './transactions.repository';
import { AccountsRepository } from '../accounts/accounts.repository';
import { NotFoundException } from '@nestjs/common';
import { OneAccountTransactionDto, TwoAccountsTransactionDto } from './dto/execute-transaction.dto';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let transactionsRepository: TransactionsRepository;
  let accountsRepository: AccountsRepository;

  const mockAccount = {
    id: 1,
    accountNo: 'ABC12345',
    balance: 100.50,
    owner: 'johndoe',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTransaction = {
    id: 1,
    amount: 50.25,
    account: 'ABC12345',
    transferTo: null,
    type: 'deposit',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTransactionsRepository = {
    getAllTransactions: jest.fn(),
    getTransactionById: jest.fn(),
    deposit: jest.fn(),
    withdraw: jest.fn(),
    transfer: jest.fn(),
  };

  const mockAccountsRepository = {
    FindOneByGeneId: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: TransactionsRepository,
          useValue: mockTransactionsRepository,
        },
        {
          provide: AccountsRepository,
          useValue: mockAccountsRepository,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    transactionsRepository = module.get<TransactionsRepository>(TransactionsRepository);
    accountsRepository = module.get<AccountsRepository>(AccountsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllTransactions', () => {
    it('should return all transactions for a user', async () => {
      const user = { username: 'johndoe' };
      mockTransactionsRepository.getAllTransactions.mockResolvedValue([mockTransaction]);

      const result = await service.getAllTransactions(user);

      expect(transactionsRepository.getAllTransactions).toHaveBeenCalledWith(user.username);
      expect(result).toEqual({
        message: "All transactions retrieved",
        data: [mockTransaction],
      });
    });
  });

  describe('getTransactionById', () => {
    it('should return transaction by id', async () => {
      const transactionId = 1;
      mockTransactionsRepository.getTransactionById.mockResolvedValue(mockTransaction);

      const result = await service.getTransactionById(transactionId);

      expect(transactionsRepository.getTransactionById).toHaveBeenCalledWith(transactionId);
      expect(result).toEqual({
        message: "Transaction retrieved",
        data: mockTransaction,
      });
    });
  });

  describe('deposit', () => {
    it('should deposit money successfully when account exists', async () => {
      const depositDto: OneAccountTransactionDto = {
        amount: 50.25,
        account: 'ABC12345',
      };

      mockAccountsRepository.FindOneByGeneId.mockResolvedValue(mockAccount);
      mockAccountsRepository.update.mockResolvedValue({});
      mockTransactionsRepository.deposit.mockResolvedValue(mockTransaction);

      const result = await service.deposit(depositDto);

      expect(accountsRepository.FindOneByGeneId).toHaveBeenCalledWith(depositDto.account);
      expect(accountsRepository.update).toHaveBeenCalledWith(
        mockAccount.id,
        mockAccount.balance + depositDto.amount
      );
      expect(transactionsRepository.deposit).toHaveBeenCalledWith(depositDto);
      expect(result).toEqual({
        message: "Deposit successful",
        data: mockTransaction,
      });
    });

    it('should throw NotFoundException when account does not exist', async () => {
      const depositDto: OneAccountTransactionDto = {
        amount: 50.25,
        account: 'NONEXISTENT',
      };

      mockAccountsRepository.FindOneByGeneId.mockResolvedValue(null);

      await expect(service.deposit(depositDto)).rejects.toThrow(NotFoundException);
      expect(accountsRepository.FindOneByGeneId).toHaveBeenCalledWith(depositDto.account);
      expect(accountsRepository.update).not.toHaveBeenCalled();
      expect(transactionsRepository.deposit).not.toHaveBeenCalled();
    });
  });

  describe('withdraw', () => {
    it('should withdraw money successfully when account exists and has sufficient balance', async () => {
      const withdrawDto: OneAccountTransactionDto = {
        amount: 25.50,
        account: 'ABC12345',
      };

      mockAccountsRepository.FindOneByGeneId.mockResolvedValue(mockAccount);
      mockAccountsRepository.update.mockResolvedValue({});
      mockTransactionsRepository.withdraw.mockResolvedValue(mockTransaction);

      const result = await service.withdraw(withdrawDto);

      expect(accountsRepository.FindOneByGeneId).toHaveBeenCalledWith(withdrawDto.account);
      expect(accountsRepository.update).toHaveBeenCalledWith(
        mockAccount.id,
        mockAccount.balance - withdrawDto.amount
      );
      expect(transactionsRepository.withdraw).toHaveBeenCalledWith(withdrawDto);
      expect(result).toEqual({
        message: "Withdrawal successful",
        data: mockTransaction,
      });
    });

    it('should throw NotFoundException when account does not exist', async () => {
      const withdrawDto: OneAccountTransactionDto = {
        amount: 25.50,
        account: 'NONEXISTENT',
      };

      mockAccountsRepository.FindOneByGeneId.mockResolvedValue(null);

      await expect(service.withdraw(withdrawDto)).rejects.toThrow(NotFoundException);
      expect(accountsRepository.FindOneByGeneId).toHaveBeenCalledWith(withdrawDto.account);
      expect(accountsRepository.update).not.toHaveBeenCalled();
      expect(transactionsRepository.withdraw).not.toHaveBeenCalled();
    });

    it('should throw Error when account has insufficient balance', async () => {
      const withdrawDto: OneAccountTransactionDto = {
        amount: 200.00,
        account: 'ABC12345',
      };

      mockAccountsRepository.FindOneByGeneId.mockResolvedValue(mockAccount);

      await expect(service.withdraw(withdrawDto)).rejects.toThrow('Insufficient balance');
      expect(accountsRepository.FindOneByGeneId).toHaveBeenCalledWith(withdrawDto.account);
      expect(accountsRepository.update).not.toHaveBeenCalled();
      expect(transactionsRepository.withdraw).not.toHaveBeenCalled();
    });
  });

  describe('transfer', () => {
    const fromAccount = { ...mockAccount, balance: 150.00 };
    const toAccount = { ...mockAccount, accountNo: 'XYZ67890', balance: 75.00 };

    it('should transfer money successfully when both accounts exist and from account has sufficient balance', async () => {
      const transferDto: TwoAccountsTransactionDto = {
        amount: 50.00,
        account: 'ABC12345',
        transferTo: 'XYZ67890',
      };

      mockAccountsRepository.FindOneByGeneId
        .mockResolvedValueOnce(fromAccount)
        .mockResolvedValueOnce(toAccount);
      mockAccountsRepository.update.mockResolvedValue({});
      mockTransactionsRepository.transfer.mockResolvedValue(mockTransaction);

      const result = await service.transfer(transferDto);

      expect(accountsRepository.FindOneByGeneId).toHaveBeenCalledWith(transferDto.account);
      expect(accountsRepository.FindOneByGeneId).toHaveBeenCalledWith(transferDto.transferTo);
      expect(accountsRepository.update).toHaveBeenCalledWith(
        fromAccount.id,
        fromAccount.balance - transferDto.amount
      );
      expect(accountsRepository.update).toHaveBeenCalledWith(
        toAccount.id,
        toAccount.balance + transferDto.amount
      );
      expect(transactionsRepository.transfer).toHaveBeenCalledWith(transferDto);
      expect(result).toEqual({
        message: "Transfer successful",
        data: mockTransaction,
      });
    });

    it('should throw NotFoundException when source account does not exist', async () => {
      const transferDto: TwoAccountsTransactionDto = {
        amount: 50.00,
        account: 'NONEXISTENT',
        transferTo: 'XYZ67890',
      };

      mockAccountsRepository.FindOneByGeneId.mockResolvedValue(null);

      await expect(service.transfer(transferDto)).rejects.toThrow('Source account not found');
      expect(accountsRepository.FindOneByGeneId).toHaveBeenCalledWith(transferDto.account);
      expect(accountsRepository.update).not.toHaveBeenCalled();
      expect(transactionsRepository.transfer).not.toHaveBeenCalled();
    });

    it('should throw Error when source account has insufficient balance', async () => {
      const transferDto: TwoAccountsTransactionDto = {
        amount: 200.00,
        account: 'ABC12345',
        transferTo: 'XYZ67890',
      };

      mockAccountsRepository.FindOneByGeneId.mockResolvedValue(fromAccount);

      await expect(service.transfer(transferDto)).rejects.toThrow('Insufficient balance');
      expect(accountsRepository.FindOneByGeneId).toHaveBeenCalledWith(transferDto.account);
      expect(accountsRepository.update).not.toHaveBeenCalled();
      expect(transactionsRepository.transfer).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when destination account does not exist', async () => {
      const transferDto: TwoAccountsTransactionDto = {
        amount: 50.00,
        account: 'ABC12345',
        transferTo: 'NONEXISTENT',
      };

      mockAccountsRepository.FindOneByGeneId
        .mockResolvedValueOnce(fromAccount)
        .mockResolvedValueOnce(null);

      await expect(service.transfer(transferDto)).rejects.toThrow('Destination account not found');
      expect(accountsRepository.FindOneByGeneId).toHaveBeenCalledWith(transferDto.account);
      expect(accountsRepository.FindOneByGeneId).toHaveBeenCalledWith(transferDto.transferTo);
      expect(accountsRepository.update).toHaveBeenCalledTimes(1);
      expect(accountsRepository.update).toHaveBeenCalledWith(
        fromAccount.id,
        fromAccount.balance - transferDto.amount
      );
      expect(transactionsRepository.transfer).not.toHaveBeenCalled();
    });
  });
});
