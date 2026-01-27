import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { InvoiceItem, InvoiceItemSchema } from './InvoiceItem.schema';
import mongoose, { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Invoice extends Document {
  @Prop()
  mode: string;

  @Prop()
  bank: string;

  @Prop()
  payment_Method: string;

  @Prop()
  total: string;

  @Prop()
  environment: string;

  @Prop({ required: true })
  token: string;

  @Prop({ type: [InvoiceItemSchema], required: true })
  items: InvoiceItem[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: mongoose.Types.ObjectId;
}

export const InvoiceSchmea = SchemaFactory.createForClass(Invoice);

InvoiceSchmea.index({ token: 1 }, { unique: true });
