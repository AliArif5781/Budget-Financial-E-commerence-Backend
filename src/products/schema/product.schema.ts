import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { category, gender, MediaType, size } from '../types/type';

export type ProductDocument = HydratedDocument<Product>;
@Schema({
  timestamps: true,
})
export class Product {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, min: 0, default: 0 })
  stock: number;

  @Prop({ default: category.Fashion })
  category: string;

  @Prop({ default: size.md, required: true })
  size: string;

  @Prop()
  mediaUrl: string;

  @Prop()
  thumbnailUrl: string;

  @Prop({ default: MediaType.image })
  mediaType: string;

  // @Prop({ required: true, lowercase: true })
  // slug: string;

  @Prop({ default: gender.men, required: true })
  gender: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
