import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ServiceStatus } from '@prisma/client';

export class CreateCustomerServiceDto {
  @IsString()
  contactId!: string;

  @IsString()
  purchaseId!: string;

  @IsOptional()
  @IsString()
  productServiceId?: string;

  @IsString()
  @Length(1, 150)
  serviceName!: string;

  @IsDateString()
  scheduledDate!: string;

  @IsOptional()
  @IsEnum(ServiceStatus)
  status?: ServiceStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
