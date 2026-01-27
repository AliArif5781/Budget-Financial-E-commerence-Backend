import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { CartItem, CartItemSchema } from 'src/cart/schema/cartItem.schema';

export type ProductDocument = HydratedDocument<Payment>;
@Schema({
  timestamps: true,
})
export class Payment {
  @Prop({ required: true })
  mode: string;

  @Prop({ required: true })
  payment_method_kind: string;

  @Prop({ required: true })
  environment: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  currency: string;

  @Prop({ required: true })
  token: string;

  @Prop({
    type: [CartItemSchema],
    required: true,
  })
  items: CartItem[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: mongoose.Types.ObjectId;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
