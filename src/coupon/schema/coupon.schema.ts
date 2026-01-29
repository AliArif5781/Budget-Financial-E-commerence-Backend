import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { type CouponStatus } from '../types/type';

export type CatDocument = HydratedDocument<Coupon>;
@Schema({
  timestamps: true,
})
export class Coupon {
  @Prop({ required: true })
  coupon: string;

  @Prop()
  total: number;

  @Prop({ default: 'unused' })
  status: CouponStatus;
}

export const couponSchema = SchemaFactory.createForClass(Coupon);
