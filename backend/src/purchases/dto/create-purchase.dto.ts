import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';
import { PaymentStatus } from '@prisma/client';

export class CreatePurchaseItemDto {
  @IsString()
  productId!: string;

  @IsNumber()
  @Min(1)
  quantity!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  unitPrice?: number;
}

export class CreatePurchaseDto {
  @IsString()
  contactId!: string;

  @IsOptional()
  @IsDateString()
  purchaseDate?: string;

  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(() => CreatePurchaseItemDto)
  items!: CreatePurchaseItemDto[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;
}
