import { Module } from '@nestjs/common';

import { ServicesController } from './services.controller';

import { CustomerServicesController } from './customer-services.controller';

import { ServicesService } from './services.service';

import { CustomerServicesService } from './customer-services.service';

@Module({
  controllers: [
    ServicesController,
    CustomerServicesController,
  ],

  providers: [
    ServicesService,
    CustomerServicesService,
  ],

  exports: [
    ServicesService,
  ],
})
export class ServicesModule {}
