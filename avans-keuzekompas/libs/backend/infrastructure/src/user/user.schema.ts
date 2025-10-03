import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  firstName!: string;

  @Prop({ required: true })
  lastName!: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ required: true, unique: true })
  studentNumber!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ enum: ['student', 'admin'], default: 'student' })
  role!: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Module' }] })
  favorites!: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
