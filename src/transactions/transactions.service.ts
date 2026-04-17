import { Injectable } from '@nestjs/common';
import { TransactionsRepository } from './transactions.repository.js';
import type { TransanctionResponse } from 'src/types/transactions.type.js';

@Injectable()
export class TransactionsService {
  constructor(private readonly transactionsRepository: TransactionsRepository) {}
  
  getAllTransactions() : TransanctionResponse {
    // return 'This action returns all transactions';
    const account = "8jl19";
    return {
      message: "All transactions retrieved",
      data: this.transactionsRepository.getAllTransactions(account)
    }
  }

  getTransactionById(id: number, account: string) : TransanctionResponse {
    // return `This action returns transaction #${id}`;
    return {
      message: "Transaction retrieved",
      data: this.transactionsRepository.getTransactionById(id, account)
    };
  }

  deposit(amount: number, account: string) : TransanctionResponse {
    // account balance increased by amount
    
    return {
      message: "Deposit successful",
      data: this.transactionsRepository.deposit(amount, account)
    };
  }

  withdraw(amount: number, account: string) : TransanctionResponse {
    // account balance decreased by amount
    return {
      message: "Withdrawal successful",
      data: this.transactionsRepository.withdraw(amount, account)
    };
  }

  transfer(amount: number, fromAccount: string, toAccount: string) : TransanctionResponse {
    // fromAccount balance decreased by amount
    // toAccount balance increased by amount
    return {
      message: "Transfer successful",
      data: this.transactionsRepository.transfer(amount, fromAccount, toAccount)
    };
  }
}
