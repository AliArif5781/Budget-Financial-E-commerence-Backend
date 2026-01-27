import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ _id: false })
export class InvoiceItem {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  })
  productId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  subtotal: number;
}

export const InvoiceItemSchema = SchemaFactory.createForClass(InvoiceItem);
