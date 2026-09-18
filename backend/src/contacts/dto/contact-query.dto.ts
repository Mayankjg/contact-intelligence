// import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

// import { Type } from 'class-transformer';

// import { ContactStatus } from '@prisma/client';

// export class ContactQueryDto {
//   @IsOptional()
//   @IsString()
//   search?: string;

//   @IsOptional()
//   @IsEnum(ContactStatus)
//   status?: ContactStatus;

//   @IsOptional()
//   @Type(() => Number)
//   @IsInt()
//   @Min(1)
//   page: number = 1;

//   @IsOptional()
//   @Type(() => Number)
//   @IsInt()
//   @Min(1)
//   @Max(100)
//   limit: number = 10;
// }


import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { Type } from 'class-transformer';

import { ContactStatus } from '@prisma/client';

export class ContactQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(ContactStatus)
  status?: ContactStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;
}