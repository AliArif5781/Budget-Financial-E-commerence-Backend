import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { category, gender, MediaType, size } from '../types/type';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsEnum(category)
  category: category;

  @IsEnum(gender)
  gender: gender;

  @IsEnum(size)
  size: size;

  @IsOptional()
  @IsEnum(MediaType)
  mediaType?: MediaType;

  @IsString()
  mediaUrl: string;

  @IsString()
  thumbnailUrl: string;
}
