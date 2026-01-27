// cart.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { CartItem, CartItemSchema } from './cartItem.schema';
// import { CartItem, CartItemSchema } from './cart-item.schema';

@Schema({
  timestamps: true,
  strict: 'throw',
})
export class Cart {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  })
  userId: mongoose.Types.ObjectId;

  @Prop({ type: [CartItemSchema], default: [] })
  items: CartItem[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);

CartSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 });
