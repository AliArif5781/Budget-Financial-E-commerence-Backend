import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ProductsModule } from './products/products.module';
import { BudgetModule } from './budget/budget.module';
import { CartModule } from './cart/cart.module';
import { PaymentsModule } from './payments/payments.module';
import { InvoiceModule } from './invoice/invoice.module';
import { ReportModule } from './report/report.module';
import { AiModule } from './ai/ai.module';
@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 3,
        },
      ],
    }),
    ConfigModule.forRoot(),
    AuthModule,
    MongooseModule.forRoot(process.env.MONGODB_URI as string),
    UserModule,
    ProductsModule,
    BudgetModule,
    CartModule,
    PaymentsModule,
    InvoiceModule,
    ReportModule,
    AiModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
