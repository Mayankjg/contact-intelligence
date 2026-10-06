import { IsDateString } from 'class-validator';

export class ReopenStockPeriodDto {
  @IsDateString()
  date!: string;
}
