import { IsDateString, IsString } from 'class-validator';

export class StockDailyReportQueryDto {
  @IsString()
  productId!: string;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;
}
