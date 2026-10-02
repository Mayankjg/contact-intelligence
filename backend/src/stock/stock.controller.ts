import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { StockMovementQueryDto } from './dto/stock-movement-query.dto';
import { StockService } from './stock.service';

@Controller('stock/movements')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  createMovement(@Body() dto: CreateStockMovementDto) {
    return this.stockService.createMovement(dto);
  }

  @Get()
  findMovements(@Query() query: StockMovementQueryDto) {
    return this.stockService.findMovements(query);
  }
}
