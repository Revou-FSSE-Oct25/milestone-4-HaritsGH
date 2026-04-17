import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { TransactionsService } from "./transactions.service.js";
import type { TransanctionResponse } from "src/types/transactions.type.js";
import { OneAccountTransactionDto, TwoAccountsTransactionDto } from "./dto/execute-transaction.dto.js";

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  getAllTransactions() : TransanctionResponse {
    return this.transactionsService.getAllTransactions();
  }

  @Get(':id')
  getTransactionById(@Param('id', ParseIntPipe) id: number, @Param('account') account: string) : TransanctionResponse {
    return this.transactionsService.getTransactionById(id, account);
  }

  @Post('/deposit')
  deposit(@Body() body: OneAccountTransactionDto) : TransanctionResponse {
    return this.transactionsService.deposit(body.amount, body.account);
  }

  @Post('/withdraw')
  withdraw(@Body() body: OneAccountTransactionDto) : TransanctionResponse {
    return this.transactionsService.withdraw(body.amount, body.account);
  }
  
  @Post('/transfer')
  transfer(@Body() body: TwoAccountsTransactionDto) : TransanctionResponse {
    return this.transactionsService.transfer(body.amount, body.account, body.transferTo);
  }
}