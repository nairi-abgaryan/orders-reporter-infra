import { Injectable } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ORDERS_CREATED, ORDERS_REPORT_FROM_YESTERDAY } from '../../conf';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Pagination, PaginationDocument } from './schemas/pagination.schema';

@Injectable()
export class OrdersService {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Order.name) private orderDocumentModel: Model<OrderDocument>,
    @InjectModel(Pagination.name)
    private paginationModel: Model<PaginationDocument>,
    private eventEmitter: EventEmitter2,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async fetchOrders() {
    const paginationData = await this.getPagingationData();
    let orders: Order[] = await lastValueFrom(
      this.httpService
        .get(
          `https://recruitment-api.dev.flipfit.io/orders?_page=${paginationData.lastPage}&_limit=${paginationData.limit}`,
        )
        .pipe(map((resp) => resp.data)),
    );

    if (orders.length === 0) {
      paginationData.lastItemsCount = 0;
      await paginationData.save();
      return;
    }

    if (
      paginationData.lastItemsCount < paginationData.limit &&
      orders.length === paginationData.lastItemsCount
    ) {
      return;
    }

    orders = await this.pageCounter(orders, paginationData);

    if (orders.length < paginationData.limit) {
      paginationData.lastItemsCount = orders.length;
    }

    const topOrderedProductsByDate = await this.topOrderedByDate(1); // start from yesterday
    const result = await this.orderDocumentModel.insertMany(orders);

    this.eventEmitter.emit(ORDERS_CREATED, result);
    this.eventEmitter.emit(
      ORDERS_REPORT_FROM_YESTERDAY,
      topOrderedProductsByDate,
    );

    return orders;
  }

  async topOrderedByDate(day: number = 1) {
    const today = new Date();
    const date = new Date(today);
    date.setDate(date.getDate() - day);
    date.setHours(0, 0, 0, 0);

    return this.orderDocumentModel.aggregate([
      {
        $unwind: {
          path: '$items',
        },
      },
      {
        $match: {
          date: {
            $gte: date,
          },
        },
      },
      {
        $group: {
          _id: '$items.product.id',
          name: {
            $first: '$items.product.name',
          },
          totalSold: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          totalSold: -1,
        },
      },
      {
        $limit: 10,
      },
    ]);
  }

  async getPagingationData(): Promise<PaginationDocument> {
    let paginationData: PaginationDocument =
      await this.paginationModel.findOne();
    if (paginationData == null) {
      paginationData = new this.paginationModel({
        lastPage: 1,
        lastItemsCount: 0,
        limit: 100,
      });
    } else {
      if (paginationData.lastItemsCount === paginationData.limit)
        paginationData.lastPage++;
    }

    return paginationData;
  }

  async pageCounter(
    orders: Order[],
    paginationData: PaginationDocument,
  ): Promise<Order[]> {
    if (
      paginationData.lastItemsCount < paginationData.limit &&
      orders.length >= paginationData.lastItemsCount
    ) {
      const length = orders.length;
      orders = orders.splice(0, paginationData.lastItemsCount);
      paginationData.lastItemsCount = length;
      await paginationData.save();

      return orders;
    }

    if (paginationData.lastItemsCount === paginationData.limit) {
      paginationData.lastItemsCount = orders.length;
      await paginationData.save();
    }

    return orders;
  }
}
