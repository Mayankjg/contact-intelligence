// import {
//   IsEmail,
//   IsEnum,
//   IsOptional,
//   IsString,
//   Length,
//   Matches,
// } from 'class-validator';

// import { ContactStatus, CustomerType } from '@prisma/client';

// export class CreateContactDto {
//   @IsString()
//   @Length(2, 50)
//   firstName!: string;

//   @IsString()
//   @Length(2, 50)
//   lastName!: string;

//   @IsString()
//   @Matches(/^\+?[0-9]{7,15}$/, {
//     message: 'Please enter a valid phone number',
//   })
//   phone!: string;

//   @IsOptional()
//   @IsEmail()
//   email?: string;

//   @IsOptional()
//   @IsString()
//   alternatePhone?: string;

//   @IsOptional()
//   @IsString()
//   company?: string;

//   @IsOptional()
//   @IsEnum(CustomerType)
//   customerType?: CustomerType;

//   @IsOptional()
//   @IsEnum(ContactStatus)
//   status?: ContactStatus;

//   @IsOptional()
//   @IsString()
//   address?: string;

//   @IsOptional()
//   @IsString()
//   city?: string;

//   @IsOptional()
//   @IsString()
//   state?: string;

//   @IsOptional()
//   @IsString()
//   country?: string;

//   @IsOptional()
//   @IsString()
//   postalCode?: string;

//   @IsOptional()
//   @IsString()
//   notes?: string;

//   @IsOptional()
//   @IsString()
//   ownerId?: string;
// }




import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

import {
  ContactStatus,
  CustomerType,
} from '@prisma/client';

export class CreateContactDto {
  @IsString()
  @Length(1, 100)
  firstName!: string;

  @IsString()
  @Length(1, 100)
  lastName!: string;

  @IsString()
  @Length(5, 30)
  phone!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  alternatePhone?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsEnum(CustomerType)
  customerType?: CustomerType;

  @IsOptional()
  @IsEnum(ContactStatus)
  status?: ContactStatus;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  ownerId?: string;
}