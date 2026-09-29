import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaymentStatus, PurchaseStatus } from '@prisma/client';

export class UpdateSaleDto {
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

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
