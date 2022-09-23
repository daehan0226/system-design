import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ autoIndex: true, _id: false })
export class UsedKeyEntity extends Document {
  @Prop({ type: String, unique: true, index: true })
  _id: string;
}

export const usedKeySchema = SchemaFactory.createForClass(UsedKeyEntity);
