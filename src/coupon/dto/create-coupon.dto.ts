import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  MinLength,
  minLength,
} from 'class-validator';

export class CreateCouponDto {
  //   @IsNotEmpty()
  //   @IsNumber()
  //   total?: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  coupon: string;
}

export class checkCouponDto {
  @IsString()
  coupon: string;

  @IsNumber({}, { message: 'total must be a number' })
  @Type(() => Number)
  total: number;
}
