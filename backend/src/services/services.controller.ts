import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { ServicesService } from './services.service';

import { CreateServiceTemplateDto } from './dto/create-service-template.dto';

import { UpdateServiceTemplateDto } from './dto/update-service-template.dto';

@Controller(
  'products/:productId/services',
)
export class ServicesController {
  constructor(
    private readonly servicesService: ServicesService,
  ) {}

  @Post()
  create(
    @Param('productId')
    productId: string,

    @Body()
    dto: CreateServiceTemplateDto,
  ) {
    return this.servicesService.create(
      productId,
      dto,
    );
  }

  @Get()
  findAll(
    @Param('productId')
    productId: string,
  ) {
    return this.servicesService.findAll(
      productId,
    );
  }

  @Get(':serviceId')
  findOne(
    @Param('productId')
    productId: string,

    @Param('serviceId')
    serviceId: string,
  ) {
    return this.servicesService.findOne(
      productId,
      serviceId,
    );
  }

  @Patch(':serviceId')
  update(
    @Param('productId')
    productId: string,

    @Param('serviceId')
    serviceId: string,

    @Body()
    dto: UpdateServiceTemplateDto,
  ) {
    return this.servicesService.update(
      productId,
      serviceId,
      dto,
    );
  }

  @Delete(':serviceId')
  remove(
    @Param('productId')
    productId: string,

    @Param('serviceId')
    serviceId: string,
  ) {
    return this.servicesService.remove(
      productId,
      serviceId,
    );
  }
}