import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { CreateStockClosureDto } from './dto/create-stock-closure.dto';
import { ReopenStockPeriodDto } from './dto/reopen-stock-period.dto';
import { StockMovementQueryDto } from './dto/stock-movement-query.dto';
import { StockService } from './stock.service';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post('movements')
  createMovement(@Body() dto: CreateStockMovementDto) {
    return this.stockService.createMovement(dto);
  }

  @Post('closures')
  closePeriod(@Body() dto: CreateStockClosureDto) {
    return this.stockService.closePeriod(dto);
  }

  @Post('closures/preview')
  previewPeriod(@Body() dto: CreateStockClosureDto) {
    return this.stockService.previewPeriod(dto);
  }

  @Post('closures/reopen')
  reopenPeriod(@Body() dto: ReopenStockPeriodDto) {
    return this.stockService.reopenPeriod(dto);
  }

  @Get('movements')
  findMovements(@Query() query: StockMovementQueryDto) {
    return this.stockService.findMovements(query);
  }
}
