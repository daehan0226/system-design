import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false, excludeIndexes: true })
export class OneLetterKeyEntity extends Document {
  @Prop({ type: String, unique: true })
  _id: string;
}

export const oneLetterKeySchema =
  SchemaFactory.createForClass(OneLetterKeyEntity);
