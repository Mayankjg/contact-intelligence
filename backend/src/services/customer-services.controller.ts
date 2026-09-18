import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ServiceStatus } from '@prisma/client';

import { CustomerServicesService } from './customer-services.service';
import { UpdateCustomerServiceDto } from './dto/update-customer-service.dto';
import { CreateCustomerServiceDto } from './dto/create-customer-service.dto';

@Controller(['services', 'customer-services'])
export class CustomerServicesController {
  constructor(
    private readonly customerServicesService: CustomerServicesService,
  ) {}

  @Post()
  create(@Body() dto: CreateCustomerServiceDto) {
    return this.customerServicesService.create(dto);
  }

  @Get()
  findAll(
    @Query('contactId') contactId?: string,
    @Query('purchaseId') purchaseId?: string,
    @Query('status') status?: ServiceStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.customerServicesService.findAll({
      contactId,
      purchaseId,
      status,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.customerServicesService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCustomerServiceDto,
  ) {
    return this.customerServicesService.update(id, dto);
  }

  @Patch(':id/complete')
  complete(
    @Param('id') id: string,
    @Body('notes') notes?: string,
  ) {
    return this.customerServicesService.complete(id, notes);
  }
}
