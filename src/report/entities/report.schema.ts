import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type reportDocument = HydratedDocument<Report>;

@Schema()
export class Report {
  @Prop({ required: true })
  message: string;

  @Prop({ default: false })
  solved: boolean;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  user: mongoose.Types.ObjectId;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
