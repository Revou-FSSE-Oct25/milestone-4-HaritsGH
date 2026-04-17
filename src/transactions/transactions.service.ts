import { Injectable } from '@nestjs/common';
import { TransactionsRepository } from './transactions.repository.js';
import { OneAccountTransactionDto, TwoAccountsTransactionDto } from './dto/execute-transaction.dto.js';

@Injectable()
export class TransactionsService {
  constructor(private readonly transactionsRepository: TransactionsRepository) {}
  
  async getAllTransactions() {
    // return 'This action returns all transactions';
    const account = "ACC001";
    return {
      message: "All transactions retrieved",
      data: await this.transactionsRepository.getAllTransactions(account)
    }
  }

  async getTransactionById(id: number) {
    // return `This action returns transaction #${id}`;
    const account = "ACC001";
    return {
      message: "Transaction retrieved",
      data: await this.transactionsRepository.getTransactionById(id, account)
    };
  }

  async deposit(dto: OneAccountTransactionDto) {
    // account balance increased by amount
    const account = "ACC001";
    return {
      message: "Deposit successful",
      data: await this.transactionsRepository.deposit(dto)
    };
  }

  async withdraw(dto: OneAccountTransactionDto) {
    // account balance decreased by amount
    return {
      message: "Withdrawal successful",
      data: await this.transactionsRepository.withdraw(dto)
    };
  }

  async transfer(dto: TwoAccountsTransactionDto) {
    // fromAccount balance decreased by amount
    // toAccount balance increased by amount
    return {
      message: "Transfer successful",
      data: await this.transactionsRepository.transfer(dto)
    };
  }
}
