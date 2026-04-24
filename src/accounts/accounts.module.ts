import { Module } from "@nestjs/common";
import { AccountsController } from "./accounts.controller";
import { AccountsService } from "./accounts.service";
import { AccountsRepository } from "./accounts.repository";
import { PrismaService } from "../prisma.service";

@Module({
  controllers: [AccountsController],
  providers: [AccountsService, AccountsRepository, PrismaService],
})
export class AccountsModule {}