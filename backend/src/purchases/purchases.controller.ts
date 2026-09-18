import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { PurchasesService } from './purchases.service';

import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';

@Controller('purchases')
export class PurchasesController {
  constructor(
    private readonly purchasesService: PurchasesService,
  ) {}

  @Post()
  create(
    @Body() dto: CreatePurchaseDto,
  ) {
    return this.purchasesService.create(
      dto,
    );
  }

  @Get()
  findAll(
    @Query('contactId')
    contactId?: string,

    @Query('page')
    page?: string,

    @Query('limit')
    limit?: string,
  ) {
    return this.purchasesService.findAll({
      contactId,

      page: page
        ? Number(page)
        : undefined,

      limit: limit
        ? Number(limit)
        : undefined,
    });
  }

  @Get(':id')
  findById(
    @Param('id') id: string,
  ) {
    return this.purchasesService.findById(
      id,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,

    @Body() dto: UpdatePurchaseDto,
  ) {
    return this.purchasesService.update(
      id,
      dto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchasesService.remove(id);
  }
}
