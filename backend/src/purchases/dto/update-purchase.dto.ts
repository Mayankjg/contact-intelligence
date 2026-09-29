import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

import { PurchaseStatus } from '@prisma/client';

export class UpdatePurchaseDto {
  @IsOptional()
  @IsDateString()
  purchaseDate?: string;

  @IsOptional()
  @IsEnum(PurchaseStatus)
  status?: PurchaseStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
