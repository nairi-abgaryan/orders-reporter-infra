import { SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductReportDocument = ProductReport & Document;

export class ProductReport {}

export const ProductReportSchema = SchemaFactory.createForClass(ProductReport);
