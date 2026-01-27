import { Type } from 'class-transformer';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class UserInvoiceItemDto {
  // @IsMongoId()
  @IsNotEmpty()
  // name: string;
  productId: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  subtotal: number;
}

export class CreateInvoiceDto {
  @IsOptional()
  @IsString()
  mode?: string;

  @IsOptional()
  @IsString()
  bank?: string;

  @IsOptional()
  @IsString()
  payment_Method?: string;

  @IsOptional()
  @IsString()
  total?: string;

  @IsString()
  @IsNotEmpty()
  token: string;

  @IsArray()
  @ValidateNested({ each: true }) //mean is  Go inside the items array and check every object using its own DTO rules.
  @Type(() => UserInvoiceItemDto) //Convert each item into a UserInvoiceItemDto instance.   // NestJS can validate nested DTOs properly
  items: UserInvoiceItemDto[];
}
