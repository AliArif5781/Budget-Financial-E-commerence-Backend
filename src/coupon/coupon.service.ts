import { BadRequestException, Injectable } from '@nestjs/common';
import { checkCouponDto, CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Coupon } from './schema/coupon.schema';
import { Model } from 'mongoose';

@Injectable()
export class CouponService {
  constructor(@InjectModel(Coupon.name) private couponModel: Model<Coupon>) {}
  async createCoupon(createCouponDto: CreateCouponDto) {
    // return 'This action adds a new coupon';
    return await this.couponModel.create({
      coupon: createCouponDto.coupon,
      total: 150,
    });
  }

  async findCoupon(checkCouponDto: checkCouponDto) {
    const check = await this.couponModel.findOne({
      coupon: checkCouponDto.coupon,
    });

    if (!check) {
      throw new BadRequestException('Invalid coupon');
    }

    if (check.status === 'used') {
      throw new BadRequestException('Coupon already used');
    }

    return check;
  }
}
