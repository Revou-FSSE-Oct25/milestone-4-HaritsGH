import { Module } from "@nestjs/common";
import { TransactionsController } from "./transactions.controller";
import { TransactionsService } from "./transactions.service";
import { TransactionsRepository } from "./transactions.repository"; // added import statement
import { PrismaService } from "../prisma.service";
import { AccountsRepository } from "../accounts/accounts.repository";

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionsRepository, PrismaService, AccountsRepository],
})
export class TransactionsModule {}