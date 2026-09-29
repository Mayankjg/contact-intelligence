import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { PurchaseStatus } from '@prisma/client';

export class UpdateSaleDto {
  @IsOptional()
  @IsEnum(PurchaseStatus)
  status?: PurchaseStatus;

  @IsOptional()
  @IsDateString()
  saleDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
