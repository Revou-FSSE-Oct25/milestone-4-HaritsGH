import { Injectable } from '@nestjs/common';
import { TransactionsRepository } from './transactions.repository.js';
// import type { TransanctionResponse } from 'src/types/transactions.type.js';

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

  async deposit(amount: number) {
    // account balance increased by amount
    const account = "ACC001";
    return {
      message: "Deposit successful",
      data: await this.transactionsRepository.deposit(amount, account)
    };
  }

  async withdraw(amount: number) {
    // account balance decreased by amount
    const account = "ACC001";
    return {
      message: "Withdrawal successful",
      data: await this.transactionsRepository.withdraw(amount, account)
    };
  }

  async transfer(amount: number, toAccount: string) {
    // fromAccount balance decreased by amount
    // toAccount balance increased by amount
    const fromAccount = "ACC001";
    return {
      message: "Transfer successful",
      data: await this.transactionsRepository.transfer(amount, fromAccount, toAccount)
    };
  }
}
