import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

export class CreatePurchaseItemDto {
  @IsString()
  productId!: string;

  @IsNumber()
  @Min(1)
  quantity!: number;
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
}