import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
// import { UserModule } from './user/user.module.js';
// import { AccountsModule } from './accounts/accounts.module.js';
import { TransactionsModule } from './transactions/transactions.module.js';
import { PrismaService } from './prisma.service.js';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  // imports: [AuthModule, UserModule, AccountsModule, TransactionsModule],
  // imports: [TransactionsModule, AuthModule],
  imports: [TransactionsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService,
    {
      provide: 'APP_GUARD',
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}

