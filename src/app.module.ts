import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TransactionsModule } from './transactions/transactions.module';
import { PrismaService } from './prisma.service.js';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { ModuleService } from './module/module.service';
import { AccountsModule } from './accounts/accounts.module';

@Module({
  imports: [TransactionsModule, AuthModule, UsersModule, AccountsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService,
    {
      provide: 'APP_GUARD',
      useClass: JwtAuthGuard,
    },
    ModuleService,
  ],
})
export class AppModule {}

