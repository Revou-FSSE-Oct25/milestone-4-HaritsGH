import { Module } from "@nestjs/common";
import { AccountsController } from "./accounts.controller.js";
import { AccountsService } from "./accounts.service.js";
import { AccountsRepository } from "./accounts.repository.js";
import { PrismaService } from "../prisma.service.js";

@Module({
  controllers: [AccountsController],
  providers: [AccountsService, AccountsRepository, PrismaService],
})
export class AccountsModule {}