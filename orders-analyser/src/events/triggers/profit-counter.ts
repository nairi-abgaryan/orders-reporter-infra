import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import * as conf from '../../conf';
import { InjectModel } from '@nestjs/mongoose';
import {
  ProductReport,
  ProductReportDocument,
} from '../../modules/orders/schemas/product-report.schema';
import { Model } from 'mongoose';
import { PRODUCT_REPORTER_SERVICE, TOP_PROFITABLE_PRODUCTS } from '../../conf';
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
  async trigger({ previousTopProfitableProducts }) {
    try {
      const topProfitableProducts = await this.productReportDocumentModel
        .find()
        .sort({ profit: -1 })
        .limit(10);

      const isEqual: boolean = compareArrays(
        topProfitableProducts,
        previousTopProfitableProducts,
      );
      if (isEqual) return;

      this.mqClient.emit(TOP_PROFITABLE_PRODUCTS, topProfitableProducts);
    } catch (e) {
      // Log an error
      console.log(e);
    }
  }
}
