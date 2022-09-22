import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false, excludeIndexes: true })
export class TwoLetterKeyEntity extends Document {
  @Prop({ type: String, unique: true })
  _id: string;
}

export const twoLetterKeySchema =
  SchemaFactory.createForClass(TwoLetterKeyEntity);
