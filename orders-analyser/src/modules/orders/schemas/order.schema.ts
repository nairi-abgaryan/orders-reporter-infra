import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  Customer,
  OrderInterface,
  ProductWithQuantity,
} from '../../interfaces';

export type OrderDocument = Order & Document;

@Schema()
export class Order implements OrderInterface {
  @Prop()
  id: string;

  @Prop({ type: Date, required: true, index: true })
  date: Date;

  @Prop({ type: {} })
  customer: Customer;

  @Prop()
  items: ProductWithQuantity[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
