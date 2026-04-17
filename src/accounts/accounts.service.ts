import { Injectable, NotFoundException } from "@nestjs/common";
import { AccountsRepository } from "./accounts.repository.js";

@Injectable()
export class AccountsService {
  constructor(private readonly accountsRepository: AccountsRepository) {}

  async create(owner: string) {
    // return 'This action adds a new account';
    const genId = Math.random().toString(36).substring(2, 10); // generate 8 character alphanumeric string
    return this.accountsRepository.create(owner, genId);
  }

  async findAll(owner: string) {
    // return 'This action returns all accounts';
    return {
      message: "All accounts retrieved.",
      data: await this.accountsRepository.findAll(owner),
    };
  }

  async findOne(id: number) {
    // return `This action returns account #${id}`;
    return {
      message: "Account retrieved.",
      data: await this.accountsRepository.findOne(id),
    };
  }

  async update(id: number, balance: number) {
    return {
      message: "Account updated.",
      data: await this.accountsRepository.update(id, balance),
    };
  }

  async remove(id: number) {
    // return `This action removes account #${id}`;
    const account = await this.accountsRepository.findOne(id);
    if (!account) {
      throw new NotFoundException("Account not found.");
    }
    return {
      message: "Account deleted.",
      data: await this.accountsRepository.remove(id),
    };
  }
}