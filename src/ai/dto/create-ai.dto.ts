import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAiDto {
  @IsString()
  name: string;

  // @IsString()
  // title?: string;

  // @IsString()
  // description?: string;

  @IsNumber()
  price: number;

  @IsNumber()
  stock: number;

  @IsString()
  gender: string;

  // @IsString()
  // category?: string;

  // @IsString()
  // size?: string;
}
