import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { OneAccountTransactionDto, TwoAccountsTransactionDto } from "./dto/execute-transaction.dto";

@Injectable()
export class TransactionsRepository {
  constructor(private readonly prisma: PrismaService) {}
  
  async getAllTransactions(ownerUsername: string) {
    const accountData = await this.prisma.account.findMany({
      where: {
        owner: ownerUsername
      }
    });
    if (accountData.length === 0) {
      throw new NotFoundException('Account not found');
    }
    return await this.prisma.transaction.findMany({
      where: {
        accountGenId: {
          in: accountData.map(account => account.geneid)
        }
      }
    });
  }
  
  async getTransactionById(id: number) {
    return await this.prisma.transaction.findUnique({
      where: {
        id
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