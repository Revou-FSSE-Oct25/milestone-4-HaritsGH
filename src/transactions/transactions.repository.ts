import { Injectable, NotFoundException } from "@nestjs/common";
// import { Transaction } from "src/types/transactions.type.js";
import { PrismaService } from "../prisma.service";

@Injectable()
export class TransactionsRepository {
  constructor(private readonly prisma: PrismaService) {}
  // private readonly mock = [
  //   {
  //     id: 1,
  //     txType: 'deposit',
  //     amount: 100000,
  //     account: "8jl19",
  //     doneAt: new Date(),
  //   },
  //   {
  //     id: 2,
  //     txType: 'withdraw',
  //     amount: 50000,
  //     account: "ssxa9",
  //     doneAt: new Date(),
  //   },
  //   {
  //     id: 3,
  //     txType: 'transfer',
  //     amount: 25000,
  //     account: "8jl19",
  //     transferTo: "ssxa9",
  //     doneAt: new Date(),
  //   },
  // ];
  
  async getAllTransactions(account: string) {
    return await this.prisma.transaction.findMany({
      where: {
        accountGenId: account
      }
    });
  }
  
  async getTransactionById(id: number, account: string) {
    return await this.prisma.transaction.findUnique({
      where: {
        id,
        accountGenId: account
      }
    });
  }

  async deposit(amount: number, account: string) {
    return await this.prisma.transaction.create({
      data: {
        txprocess: 'D',
        amount,
        accountGenId: account,
        doneAt: new Date(),
      }
    });
  }
  
  async withdraw(amount: number, account: string) {
    return await this.prisma.transaction.create({
      data: {
        txprocess: 'W',
        amount,
        accountGenId: account,
        doneAt: new Date(),
      }
    });
  }
  
  async transfer(amount: number, account: string, transferTo: string) {
    return await this.prisma.transaction.create({
      data: {
        txprocess: 'T',
        amount,
        accountGenId: account,
        doneAt: new Date(),
        transferTo
      }
    });
  }
}