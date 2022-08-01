import { Document } from 'mongoose';
import { SchemaFactory } from '@nestjs/mongoose';

export type OrderDocument = Order & Document;
export class Order {}

export const OrderSchema = SchemaFactory.createForClass(Order);
