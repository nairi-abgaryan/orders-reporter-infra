import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PaginationDocument = Pagination & Document;

@Schema()
export class Pagination {
  @Prop()
  lastPage: number;

  @Prop()
  lastItemsCount: number;

  @Prop()
  limit: number;
}

export const PaginationSchema = SchemaFactory.createForClass(Pagination);
