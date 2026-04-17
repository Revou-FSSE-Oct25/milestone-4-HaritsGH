import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Request } from '@nestjs/common';
import { AccountsService } from './accounts.service.js';
import { UpdateAccountDto } from './dto/update-accounts.dto.js';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  create(@Request() req: any) {
    return this.accountsService.create(req.user.username);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.accountsService.findAll(req.user.username);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.accountsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAccountDto,
  ) {
    return this.accountsService.update(id, dto.amount);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.accountsService.remove(id);
  }
} 