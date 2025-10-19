import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Module extends Document {
  @Prop({ required: true })
  title!: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  location!: string;

  @Prop({ enum: ['P1', 'P2', 'P3', 'P4'], required: true })
  period!: string;

  @Prop({ required: true })
  studentCredits!: number;

  @Prop({ enum: ['NL', 'EN'], required: true })
  language!: string;

  @Prop()
  level?: string;

  @Prop()
  duration?: string;

  @Prop()
  offeredBy?: string;
}

export const ModuleSchema = SchemaFactory.createForClass(Module);

ModuleSchema.index({ title: 1, location: 1 }, { unique: true }); // Unique index on title and location