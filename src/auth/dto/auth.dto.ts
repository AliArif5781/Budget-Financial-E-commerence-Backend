import {
  IsEmail,
  IsNotEmpty,
  IsString,
  isString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class signupDto {
  @IsString()
  @MinLength(3)
  @MaxLength(21)
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @MinLength(3)
  @MaxLength(21)
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;
}

export class LoginDto {
  @IsEmail()
  // @IsNotEmpty()
  email: string;

  @IsString()
  // @MinLength(8)
  // @IsNotEmpty()
  password: string;
}
