import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
// import { AuthModule } from './auth/auth.module.js';
// import { UserModule } from './user/user.module.js';
// import { AccountsModule } from './accounts/accounts.module.js';
import { TransactionsModule } from './transactions/transactions.module.js';
import { PrismaService } from './prisma.service.js';
import { AuthModule } from './auth/auth.module';

@Module({
  // imports: [AuthModule, UserModule, AccountsModule, TransactionsModule],
  imports: [TransactionsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}

