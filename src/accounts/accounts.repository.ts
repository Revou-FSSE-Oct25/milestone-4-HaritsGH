import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class AccountsRepository {
  constructor(private readonly prisma: PrismaService) {}
  
  findAll(owner: string) {
    return this.prisma.account.findMany({
      where: {
        owner,
      },
    });
  }
  
  findOne(id: number) {
    return this.prisma.account.findUnique({
      where: {
        id,
      },
    });
  }

  FindOneByGeneId(geneid: string) {
    return this.prisma.account.findUnique({
      where: {
        geneid,
      },
    });
  }

  create(owner: string, geneid: string) {
    return this.prisma.account.create({
      data: {
        owner,
        geneid,
      },
    });
  }

  update(id: number, balance: number) {
    return this.prisma.account.update({
      where: {
        id,
      },
      data: {
        balance,
      },
    });
  }

  remove(id: number) {
    return this.prisma.account.delete({
      where: {
        id,
      },
    });
  }
}
