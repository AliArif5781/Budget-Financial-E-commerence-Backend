import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsMongoId,
  Min,
  ValidateNested,
  ArrayNotEmpty,
  IsString,
} from 'class-validator';

export class CartItemInput {
  // @IsMongoId() // ✅ validates ObjectId format
  @IsString()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateCartDto {
  @IsArray()
  @ArrayNotEmpty() // ✅ must send at least one item
  @ValidateNested({ each: true })
  @Type(() => CartItemInput)
  items: CartItemInput[];
}
