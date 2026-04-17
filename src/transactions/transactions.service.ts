import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionsRepository } from './transactions.repository.js';
import { OneAccountTransactionDto, TwoAccountsTransactionDto } from './dto/execute-transaction.dto.js';
import { AccountsRepository } from '../accounts/accounts.repository.js';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly accountsRepository: AccountsRepository
  ) {}
  
  async getAllTransactions(owner: {username: string}) {
    // return 'This action returns all transactions';
    return {
      message: "All transactions retrieved",
      data: await this.transactionsRepository.getAllTransactions(owner.username)
    }
  }

  async getTransactionById(id: number) {
    // return `This action returns transaction #${id}`;
    return {
      message: "Transaction retrieved",
      data: await this.transactionsRepository.getTransactionById(id)
    };
  }

  async deposit(dto: OneAccountTransactionDto) {
    // account balance increased by amount
    const account = await this.accountsRepository.findOneByGenId(dto.account);
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    await this.accountsRepository.update(account.id, account.balance + dto.amount);

    return {
      message: "Deposit successful",
      data: await this.transactionsRepository.deposit(dto)
    };
  }

  async withdraw(dto: OneAccountTransactionDto) {
    // account balance decreased by amount
    const account = await this.accountsRepository.findOneByGenId(dto.account);
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.balance < dto.amount) {
      throw new Error('Insufficient balance');
    }

    await this.accountsRepository.update(account.id, account.balance - dto.amount);
    
    return {
      message: "Withdrawal successful",
      data: await this.transactionsRepository.withdraw(dto)
    };
  }

  async transfer(dto: TwoAccountsTransactionDto) {
    // fromAccount balance decreased by amount
    const fromAccount = await this.accountsRepository.findOneByGenId(dto.account);
    if (!fromAccount) {
      throw new NotFoundException('Source account not found');
    }

    if (fromAccount.balance < dto.amount) {
      throw new Error('Insufficient balance');
    }

    await this.accountsRepository.update(fromAccount.id, fromAccount.balance - dto.amount);
    
    // toAccount balance increased by amount
    const toAccount = await this.accountsRepository.findOneByGenId(dto.transferTo);
    if (!toAccount) {
      throw new NotFoundException('Destination account not found');
    }
    await this.accountsRepository.update(toAccount.id, toAccount.balance + dto.amount);
    
    return {
      message: "Transfer successful",
      data: await this.transactionsRepository.transfer(dto)
    };
  }
}
