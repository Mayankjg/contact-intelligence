import { StockMovementType, StockOutwardPurpose } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min as MinNumber,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateStockMovementDto {
  @IsString()
  productId!: string;

  @IsEnum(StockMovementType)
  type!: StockMovementType;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity!: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  supplier?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  customer?: string;

  @IsOptional()
  @IsEnum(StockOutwardPurpose)
  purpose?: StockOutwardPurpose;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  invoiceNo?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @MinNumber(0)
  unitPrice?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  batchNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  warehouse?: string;

  @IsOptional()
  @IsDateString()
  occurredAt?: string;
}
