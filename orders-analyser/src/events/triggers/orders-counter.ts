import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import * as conf from '../../conf';
import { InjectModel } from '@nestjs/mongoose';
import {
  ProductReport,
  ProductReportDocument,
} from '../../modules/orders/schemas/product-report.schema';
import { Model } from 'mongoose';
import { PRODUCT_REPORTER_SERVICE } from '../../conf';
import { ClientProxy } from '@nestjs/microservices';
import { compareArrays } from '../../utils/compare';

@Injectable()
export class ProfitCounter {
  constructor(
    @InjectModel(ProductReport.name)
    private productReportDocumentModel: Model<ProductReportDocument>,
    @Inject(PRODUCT_REPORTER_SERVICE) private mqClient: ClientProxy,
  ) {}
  @OnEvent(conf.PRODUCTS_REPORT_CREATED, { async: true })
  async trigger({ topPrevOrderedProducts }) {
    const topOrderedProducts = await this.productReportDocumentModel
      .find()
      .sort({ ordersCount: -1 })
      .limit(10);

    if (compareArrays(topOrderedProducts, topPrevOrderedProducts)) return;

    this.mqClient.emit('top-ordered-products', topOrderedProducts);
  }
}
