import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateSaleItemDto {
  @IsString()
  productId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  unitPrice?: number;
}
