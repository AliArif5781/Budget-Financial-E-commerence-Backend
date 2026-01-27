import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '../types/user.type';

export type UserDocument = HydratedDocument<User>;
@Schema({
  timestamps: true,
})
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ default: Role.User })
  role: string;

  @Prop()
  phone?: string;

  @Prop()
  city?: string;

  @Prop()
  zip?: string;

  @Prop()
  address?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
