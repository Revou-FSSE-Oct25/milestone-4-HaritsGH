import { Injectable, NotFoundException } from "@nestjs/common";
// import { Transaction } from "src/types/transactions.type.js";
import { PrismaService } from "../prisma.service";
import { OneAccountTransactionDto, TwoAccountsTransactionDto } from "./dto/execute-transaction.dto";

@Injectable()
export class TransactionsRepository {
  constructor(private readonly prisma: PrismaService) {}
  
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

  async deposit(dto: OneAccountTransactionDto) {
    return await this.prisma.transaction.create({
      data: {
        txprocess: 'D',
        amount: dto.amount,
        accountGenId: dto.account,
        doneAt: new Date(),
      }
    });
  }
  
  async withdraw(dto: OneAccountTransactionDto) {
    return await this.prisma.transaction.create({
      data: {
        txprocess: 'W',
        amount: dto.amount,
        accountGenId: dto.account,
        doneAt: new Date(),
      }
    });
  }
  
  async transfer(dto: TwoAccountsTransactionDto) {
    return await this.prisma.transaction.create({
      data: {
        txprocess: 'T',
        amount: dto.amount,
        accountGenId: dto.account,
        doneAt: new Date(),
        transferTo: dto.transferTo
      }
    });
  }
}