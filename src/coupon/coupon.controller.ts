import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { checkCouponDto, CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post('create-coupon')
  async create(@Body() createCouponDto: CreateCouponDto) {
    return await this.couponService.createCoupon(createCouponDto);
  }

  @Post('check-coupon')
  findAll(@Body() checkCouponDto: checkCouponDto) {
    console.log(checkCouponDto, typeof checkCouponDto.total);
    return this.couponService.findCoupon(checkCouponDto);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.couponService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCouponDto: UpdateCouponDto) {
  //   return this.couponService.update(+id, updateCouponDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.couponService.remove(+id);
  // }
}
