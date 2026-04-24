import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Request } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { UpdateAccountDto } from './dto/update-accounts.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiBearerAuth('JWT')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new account of logged in user' })
  @ApiResponse({ status: 200, description: 'Account created successfully'})
  create(@Request() req: any) {
    return this.accountsService.create(req.user.username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all accounts of logged in user' })
  @ApiResponse({ status: 200, description: 'All accounts retrieved.'})
  findAll(@Request() req: any) {
    return this.accountsService.findAll(req.user.username);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get account by id' })
  @ApiResponse({ status: 200, description: 'Account retrieved.'})
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.accountsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update account balance' })
  @ApiResponse({ status: 200, description: 'Account updated.'})
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAccountDto,
  ) {
    return this.accountsService.update(id, dto.amount);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete account by id' })
  @ApiResponse({ status: 200, description: 'Account deleted.'})
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.accountsService.remove(id);
  }
} 