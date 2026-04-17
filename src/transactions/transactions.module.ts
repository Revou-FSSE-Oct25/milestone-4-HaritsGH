import { Module } from "@nestjs/common";
import { TransactionsController } from "./transactions.controller.js";
import { TransactionsService } from "./transactions.service.js";
import { TransactionsRepository } from "./transactions.repository.js"; // added import statement
import { PrismaService } from "../prisma.service";
import { AccountsRepository } from "../accounts/accounts.repository.js";

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionsRepository, PrismaService, AccountsRepository],
})
export class TransactionsModule {}