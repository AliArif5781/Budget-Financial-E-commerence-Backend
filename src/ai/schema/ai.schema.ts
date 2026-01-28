import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { categoryEnum, genderEnum, SizeEnum } from '../types/ai.type';

export type AiDocument = HydratedDocument<Ai>;
@Schema({
  timestamps: true,
})
export class Ai {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  title?: string;

  @Prop({ required: true })
  description?: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  stock: number;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  category?: string;

  @Prop({ required: true })
  size?: string;
}

export const AiSchema = SchemaFactory.createForClass<Ai>;
