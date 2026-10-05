import { IsDateString } from 'class-validator';

export class CreateStockClosureDto {
  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;
}
