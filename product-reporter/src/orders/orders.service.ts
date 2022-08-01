import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { Model } from 'mongoose';
import { ProductReport } from './schemas/product-report.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderDocumentModel: Model<OrderDocument>,
    @InjectModel(ProductReport.name)
    private productReportDocumentModel: Model<OrderDocument>,
  ) {}

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
  async topOrdered() {
    return this.productReportDocumentModel
      .find()
      .sort({ ordersCount: -1 })
      .limit(10);
  }

  async topProfitable() {
    return this.productReportDocumentModel
      .find()
      .sort({ ordersCount: -1 })
      .limit(10);
  }
}
