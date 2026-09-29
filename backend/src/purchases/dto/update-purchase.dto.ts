import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

import { PaymentStatus, PurchaseStatus } from '@prisma/client';

export class UpdatePurchaseDto {
  @IsOptional()
  @IsDateString()
  purchaseDate?: string;

  @IsOptional()
  @IsEnum(PurchaseStatus)
  status?: PurchaseStatus;

  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
