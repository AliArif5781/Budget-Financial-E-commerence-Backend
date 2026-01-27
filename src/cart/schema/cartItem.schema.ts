// cart-item.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ _id: false }) // 👈 no extra _id for each item
export class CartItem {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  })
  productId: mongoose.Types.ObjectId;

  @Prop({ type: Number, required: true, min: 1, default: 1 })
  quantity: number;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);
