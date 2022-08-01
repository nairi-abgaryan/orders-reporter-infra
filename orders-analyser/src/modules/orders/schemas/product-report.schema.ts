import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductReportDocument = ProductReport & Document;

@Schema()
export class ProductReport {
  @Prop({ unique: true, index: true })
  id: string;

  @Prop({ index: true })
  profit: number;

  @Prop({ index: true })
  ordersCount: number;
}

export const ProductReportSchema = SchemaFactory.createForClass(ProductReport);
