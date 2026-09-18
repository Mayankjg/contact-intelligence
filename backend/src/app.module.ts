// import { Module } from '@nestjs/common';

// import { ConfigModule } from '@nestjs/config';

// import { PrismaModule } from './prisma/prisma.module';

// import { ContactsModule } from './contacts/contacts.module';

// import { ProductsModule } from './products/products.module';

// import { OrdersModule } from './orders/orders.module';
// import { PurchasesModule } from './purchases/purchases.module';
// import { ServicesService } from './services/services.service';
// import { ServicesController } from './services/services.controller';
// import { ServicesModule } from './services/services.module';
// import { FollowupsModule } from './followups/followups.module';

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true,
//     }),

//     PrismaModule,

//     ContactsModule,

//     ProductsModule,

//     OrdersModule,

//     PurchasesModule,

//     ServicesModule,

//     FollowupsModule,
//   ],
//   providers: [ServicesService],
//   controllers: [ServicesController],
// })
// export class AppModule {}

//------------------------------------------------------------------------------


// import { Module } from '@nestjs/common';

// import { PrismaModule } from './prisma/prisma.module';

// import { ContactsModule } from './contacts/contacts.module';
// import { ProductsModule } from './products/products.module';
// import { PurchasesModule } from './purchases/purchases.module';
// import { ServicesModule } from './services/services.module';
// import { FollowupsModule } from './followups/followups.module';

// @Module({
//   imports: [
//     PrismaModule,

//     ContactsModule,

//     ProductsModule,

//     PurchasesModule,

//     ServicesModule,

//     FollowupsModule,
//   ],
// })
// export class AppModule {}




import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './prisma/prisma.module';

import { ContactsModule } from './contacts/contacts.module';

import { ProductsModule } from './products/products.module';

import { PurchasesModule } from './purchases/purchases.module';

import { ServicesModule } from './services/services.module';

import { FollowupsModule } from './followups/followups.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    PrismaModule,

    AuthModule,

    ContactsModule,

    ProductsModule,

    PurchasesModule,

    ServicesModule,

    FollowupsModule,
  ],
})
export class AppModule {}
