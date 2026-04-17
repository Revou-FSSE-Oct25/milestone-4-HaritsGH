import { Body, Controller, Get, Param, ParseIntPipe, Post, Request } from "@nestjs/common";
import { TransactionsService } from "./transactions.service.js";
import { OneAccountTransactionDto, TwoAccountsTransactionDto } from "./dto/execute-transaction.dto.js";
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiBearerAuth('JWT')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all transactions' })
  @ApiResponse({ status: 200, description: 'All transactions retrieved successfully' })
  async getAllTransactions(@Request() req: any) {
    return await this.transactionsService.getAllTransactions(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction by id' })
  @ApiResponse({ status: 200, description: 'Transaction retrieved successfully' })
  async getTransactionById(@Param('id', ParseIntPipe) id: number) {
    return await this.transactionsService.getTransactionById(id);
  }

  @Post('/deposit')
  @ApiOperation({ summary: 'Deposit money' })
  @ApiResponse({ status: 200, description: 'Deposit successful' })
  async deposit(@Body() body: OneAccountTransactionDto) {
    return await this.transactionsService.deposit(body);
  }

  @Post('/withdraw')
  @ApiOperation({ summary: 'Withdraw money' })
  @ApiResponse({ status: 200, description: 'Withdraw successful' })
  async withdraw(@Body() body: OneAccountTransactionDto) {
    return await this.transactionsService.withdraw(body);
  }
  
  @Post('/transfer')
  @ApiOperation({ summary: 'Transfer money' })
  @ApiResponse({ status: 200, description: 'Transfer successful' })
  async transfer(@Body() body: TwoAccountsTransactionDto) {
    return await this.transactionsService.transfer(body);
  }
}