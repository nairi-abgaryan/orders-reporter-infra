import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Inject, Injectable } from '@nestjs/common';
import {
  OrderDocument,
  Order,
} from '../../modules/orders/schemas/order.schema';
import { InjectModel } from '@nestjs/mongoose';
import {
  ProductReport,
  ProductReportDocument,
} from '../../modules/orders/schemas/product-report.schema';
import * as conf from '../../conf';
import { Model } from 'mongoose';
import { ClientProxy } from '@nestjs/microservices';
import { MapReduceProducts } from './map-reduce-products';
import { PRODUCT_REPORTER_SERVICE, PRODUCTS_REPORT_CREATED } from '../../conf';

@Injectable()
export class OrdersCreatedHandler {
  constructor(
    @InjectModel(Order.name) private orderDocumentModel: Model<OrderDocument>,
    @InjectModel(ProductReport.name)
    private productReportDocumentModel: Model<ProductReportDocument>,
    private eventEmitter: EventEmitter2,
    @Inject(PRODUCT_REPORTER_SERVICE) private client: ClientProxy,
  ) {}

  @OnEvent(conf.ORDERS_CREATED, { async: true })
  async orderCreatedHandler(orders: Order[]) {
    try {
      const mappedProducts = await new MapReduceProducts(orders).products();
      const productReport = await this.generateProductReport(mappedProducts);

      const previousTopProfitableProducts =
        await this.productReportDocumentModel
          .find()
          .sort({ profit: -1 })
          .limit(10);

      const topPrevOrderedProducts = await this.productReportDocumentModel
        .find()
        .sort({ profit: -1 })
        .limit(10);
      await this.productReportDocumentModel.bulkSave(productReport);

      this.eventEmitter.emit(PRODUCTS_REPORT_CREATED, {
        topPrevOrderedProducts,
        previousTopProfitableProducts,
      });
    } catch (e) {
      throw new Error(
        'Here should be mechanism for handling error cases and repeat the action',
      );
    }
  }

  async generateProductReport(
    mappedProducts,
  ): Promise<ProductReportDocument[]> {
    const existingProductsReport = await this.productReportDocumentModel.find({
      id: {
        $in: mappedProducts.ids,
      },
    });

    for (const productReport of existingProductsReport) {
      productReport.profit += mappedProducts.products.get(
        productReport.id,
      ).profit;
      productReport.ordersCount += mappedProducts.products.get(
        productReport.id,
      ).ordersCount;
      mappedProducts.products.delete(productReport.id);
    }

    for (const productId of mappedProducts.products.keys()) {
      const productReport = new this.productReportDocumentModel({
        id: productId,
        profit: mappedProducts.products.get(productId).profit,
        ordersCount: mappedProducts.products.get(productId).ordersCount,
      });

      existingProductsReport.push(productReport);
    }

    return existingProductsReport;
  }
}
