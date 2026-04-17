import { Module } from "@nestjs/common";
import { TransactionsController } from "./transactions.controller.js";
import { TransactionsService } from "./transactions.service.js";
import { TransactionsRepository } from "./transactions.repository.js"; // added import statement

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionsRepository],
})
export class TransactionsModule {}