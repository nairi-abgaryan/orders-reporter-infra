import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import * as conf from '../../conf';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PRODUCT_REPORTER_SERVICE } from '../../conf';
import { ClientProxy } from '@nestjs/microservices';
import {
  Order,
  OrderDocument,
} from '../../modules/orders/schemas/order.schema';
import { OrdersService } from '../../modules/orders/orders.service';
import { compareArrays } from '../../utils/compare';

@Injectable()
export class OrdersCounterByDate {
  constructor(
    @Inject(PRODUCT_REPORTER_SERVICE) private mqClient: ClientProxy,
    @InjectModel(Order.name) private orderDocumentModel: Model<OrderDocument>,
    private readonly ordersService: OrdersService,
  ) {}

  @OnEvent(conf.ORDERS_REPORT_FROM_YESTERDAY, { async: true })
  async trigger(previousTopOrderedProductsByDate) {
    const currentTopOrderedProductsByDate =
      await this.ordersService.topOrderedByDate();
    const isEqual = compareArrays(
      currentTopOrderedProductsByDate,
      previousTopOrderedProductsByDate,
    );

    if (isEqual) return;

    this.mqClient.emit(
      'top-ordered-products-from-yesterday',
      currentTopOrderedProductsByDate,
    );
  }
}
