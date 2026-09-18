import { IsString, Length } from 'class-validator';

export class LoginDto {
  @IsString()
  @Length(3, 50)
  name!: string;

  @IsString()
  @Length(8, 128)
  password!: string;
}
