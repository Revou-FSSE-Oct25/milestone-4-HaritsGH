import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { TransactionsService } from "./transactions.service.js";
import type { TransanctionResponse } from "src/types/transactions.type.js";
import { OneAccountTransactionDto, TwoAccountsTransactionDto } from "./dto/execute-transaction.dto.js";

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async getAllTransactions() {
    return await this.transactionsService.getAllTransactions();
  }

  @Get(':id')
  async getTransactionById(@Param('id', ParseIntPipe) id: number) {
    return await this.transactionsService.getTransactionById(id);
  }

  @Post('/deposit')
  async deposit(@Body() body: OneAccountTransactionDto) {
    return await this.transactionsService.deposit(body.amount);
  }

  @Post('/withdraw')
  async withdraw(@Body() body: OneAccountTransactionDto) {
    return await this.transactionsService.withdraw(body.amount);
  }
  
  @Post('/transfer')
  async transfer(@Body() body: TwoAccountsTransactionDto) {
    return await this.transactionsService.transfer(body.amount, body.transferTo);
  }
}