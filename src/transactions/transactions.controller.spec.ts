import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { OneAccountTransactionDto, TwoAccountsTransactionDto } from './dto/execute-transaction.dto';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let transactionsService: TransactionsService;

  const mockTransaction = {
    id: 1,
    amount: 100.50,
    account: 'ABC12345',
    transferTo: null,
    type: 'deposit',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTransactionsService = {
    getAllTransactions: jest.fn().mockResolvedValue({
      message: 'All transactions retrieved successfully.',
      data: [mockTransaction],
    }),
    getTransactionById: jest.fn().mockResolvedValue({
      message: 'Transaction retrieved successfully.',
      data: mockTransaction,
    }),
    deposit: jest.fn().mockResolvedValue({
      message: 'Deposit successful',
      data: mockTransaction,
    }),
    withdraw: jest.fn().mockResolvedValue({
      message: 'Withdraw successful',
      data: mockTransaction,
    }),
    transfer: jest.fn().mockResolvedValue({
      message: 'Transfer successful',
      data: mockTransaction,
    }),
  };

  const mockRequest = {
    user: {
      username: 'johndoe',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: mockTransactionsService,
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    transactionsService = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /transactions', () => {
    it('should get all transactions of logged in user successfully', async () => {
      const result = await controller.getAllTransactions(mockRequest);

      expect(result).toEqual({
        message: 'All transactions retrieved successfully.',
        data: [mockTransaction],
      });
    });
  });

  describe('GET /transactions/:id', () => {
    it('should get transaction by id successfully', async () => {
      const transactionId = 1;
      const result = await controller.getTransactionById(transactionId);

      expect(result).toEqual({
        message: 'Transaction retrieved successfully.',
        data: mockTransaction,
      });
    });
  });

  describe('POST /transactions/deposit', () => {
    it('should deposit money successfully', async () => {
      const depositDto: OneAccountTransactionDto = {
        amount: 150.75,
        account: 'ABC12345',
      };

      const result = await controller.deposit(depositDto);

      expect(result).toEqual({
        message: 'Deposit successful',
        data: mockTransaction,
      });
    });
  });

  describe('POST /transactions/withdraw', () => {
    it('should withdraw money successfully', async () => {
      const withdrawDto: OneAccountTransactionDto = {
        amount: 50.25,
        account: 'ABC12345',
      };

      const result = await controller.withdraw(withdrawDto);

      expect(result).toEqual({
        message: 'Withdraw successful',
        data: mockTransaction,
      });
    });
  });

  describe('POST /transactions/transfer', () => {
    it('should transfer money successfully', async () => {
      const transferDto: TwoAccountsTransactionDto = {
        amount: 75.50,
        account: 'ABC12345',
        transferTo: 'XYZ99999',
      };

      const result = await controller.transfer(transferDto);

      expect(result).toEqual({
        message: 'Transfer successful',
        data: mockTransaction,
      });
    });
  });
});
