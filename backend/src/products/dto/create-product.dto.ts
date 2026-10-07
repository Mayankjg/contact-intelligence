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
  IsDateString,
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
  @Length(1, 200)
  supplierName!: string;

  @IsDateString()
  purchaseDate!: string;

  @IsNumber()
  @Min(0)
  unitCost!: number;

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
