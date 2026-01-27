import { PartialType } from '@nestjs/mapped-types';
import { CreateCartDto } from './create-cart.dto';

export class UpdateCartDto extends PartialType(CreateCartDto) {
  productId: string;
  quantity: number; // +ve to increase, -ve to decrease
}
