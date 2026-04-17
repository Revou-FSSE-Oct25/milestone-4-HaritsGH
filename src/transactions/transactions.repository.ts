import { Injectable, NotFoundException } from "@nestjs/common";
import { Transaction } from "src/types/transactions.type.js";

@Injectable()
export class TransactionsRepository {
  private readonly mock = [
    {
      id: 1,
      txType: 'deposit',
      amount: 100000,
      account: "8jl19",
      doneAt: new Date(),
    },
    {
      id: 2,
      txType: 'withdraw',
      amount: 50000,
      account: "ssxa9",
      doneAt: new Date(),
    },
    {
      id: 3,
      txType: 'transfer',
      amount: 25000,
      account: "8jl19",
      transferTo: "ssxa9",
      doneAt: new Date(),
    },
  ];
  
  getAllTransactions(account: string) : Transaction[] {
    return this.mock.filter((t) => t.account === account);
  }
  
  getTransactionById(id: number, account: string) : Transaction[] {
    const transaction = this.mock.find((t) => t.id === id && t.account === account);
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return [transaction];
  }

  deposit(amount: number, account: string) : Transaction[] {
    const transaction = {
      id: this.mock.length + 1,
      txType: 'deposit',
      amount,
      account,
      doneAt: new Date(),
    };
    this.mock.push(transaction);
    return [transaction];
  }
  
  withdraw(amount: number, account: string) : Transaction[] {
    const transaction = {
      id: this.mock.length + 1,
      txType: 'withdraw',
      amount,
      account,
      doneAt: new Date(),
    };
    this.mock.push(transaction);
    return [transaction];
  }
  
  transfer(amount: number, account: string, transferTo: string) : Transaction[] {
    const transaction = {
      id: this.mock.length + 1,
      txType: 'transfer',
      amount,
      account,
      transferTo,
      doneAt: new Date(),
    };
    this.mock.push(transaction);
    return [transaction];
  }
}