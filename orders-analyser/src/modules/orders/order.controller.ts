import { Controller, Get } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './schemas/order.schema';

@Controller()
export class OrderController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('/orders')
  getHello(): Promise<Order[]> {
    return this.ordersService.fetchOrders();
  }
}
