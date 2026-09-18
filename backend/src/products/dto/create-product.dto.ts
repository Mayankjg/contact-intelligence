// import {
//   IsEnum,
//   IsInt,
//   IsNumber,
//   IsOptional,
//   IsString,
//   Length,
//   Min,
// } from 'class-validator';

// import { ProductStatus } from '@prisma/client';

// export class CreateProductDto {
//   @IsString()
//   @Length(2, 150)
//   name!: string;

//   @IsString()
//   @Length(2, 50)
//   sku!: string;

//   @IsOptional()
//   @IsString()
//   description?: string;

//   @IsNumber()
//   @Min(0)
//   price!: number;

//   @IsInt()
//   @Min(0)
//   stock!: number;

//   @IsOptional()
//   @IsEnum(ProductStatus)
//   status?: ProductStatus;

//   @IsOptional()
//   @IsString()
//   category?: string;
// }




import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

import { ProductStatus } from '@prisma/client';

export class CreateProductDto {
  @IsString()
  @Length(2, 150)
  name!: string;

  @IsString()
  @Length(2, 50)
  sku!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsInt()
  @Min(0)
  stock!: number;

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @IsOptional()
  @IsString()
  category?: string;
}