import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BudgetLevel } from '../dto/create-budget.dto';
// import { category, gender, MediaType, size } from '../types/type';

export type ProductDocument = HydratedDocument<Budget>;
@Schema({
  timestamps: true,
})
export class Budget {
  @Prop({ required: true, min: 0 })
  budgetAmount: number;

  @Prop({ type: Boolean, default: true })
  budgetSet: boolean;

  @Prop({ default: BudgetLevel.$ })
  budgetCurrency: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: mongoose.Types.ObjectId;
}

export const BudgetSchema = SchemaFactory.createForClass(Budget);
