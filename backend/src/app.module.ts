import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ContactsModule } from './contacts/contacts.module';
import { ProductsModule } from './products/products.module';
import { PurchasesModule } from './purchases/purchases.module';
import { ServicesModule } from './services/services.module';
import { FollowupsModule } from './followups/followups.module';
import { SalesModule } from './sales/sales.module';
import { StockModule } from './stock/stock.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ContactsModule,
    ProductsModule,
    PurchasesModule,
    ServicesModule,
    FollowupsModule,
    SalesModule,
    StockModule,
  ],
})
export class AppModule {}
