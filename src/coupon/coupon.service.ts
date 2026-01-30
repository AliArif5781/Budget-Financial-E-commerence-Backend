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
    return await this.couponModel.create({
      coupon: createCouponDto.coupon,
      total: 150,
    });
  }

  async findCoupon(checkCouponDto: checkCouponDto) {
    const checkcoupon = await this.couponModel.findOne({
      coupon: checkCouponDto.coupon,
    });

    if (!checkcoupon) {
      throw new BadRequestException('Invalid coupon');
    }

    if (checkcoupon.status !== 'unused') {
      throw new BadRequestException('Invalid coupon');
    }

    // 3. Apply 5% discount
    const discount = Number(checkCouponDto.total) * 0.05;
    const total = Number(checkCouponDto.total) - discount;

    checkcoupon.status = 'used';
    await checkcoupon.save();

    return {
      total,
      message: 'Coupon Applied',
      appliedCoupon: checkCouponDto.coupon,
    };
  }
}
