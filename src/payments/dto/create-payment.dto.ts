import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { CartItem } from 'src/cart/schema/cartItem.schema';

export class CreatePaymentDto {
  @IsString()
  mode: string;

  @IsString()
  payment_method_kind: string;

  @IsNumber()
  amount: number;

  @IsString()
  currency: string;

  @IsString()
  environment: string;

  @IsString()
  token: string;

  @IsArray()
  @ValidateNested({ each: true })
  items: CartItem[];
}
