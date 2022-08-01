import { Controller } from '@nestjs/common';
import { ProductReportService } from './product-report.service';
import { EventPattern } from '@nestjs/microservices';
import {
  TOP_ORDERED_PRODUCTS,
  TOP_ORDERED_PRODUCTS_FROM_YESTERDAY,
  TOP_PROFITABLE_PRODUCTS,
} from '../conf';

@Controller()
export class ProductReportController {
  constructor(private readonly productReportService: ProductReportService) {}

  @EventPattern(TOP_PROFITABLE_PRODUCTS)
  async handleTopProfitableProducts(data: Record<string, unknown>) {
    await this.productReportService.cacheData(TOP_PROFITABLE_PRODUCTS, data);
  }

  @EventPattern(TOP_ORDERED_PRODUCTS)
  async handleTopOrderedProducts(data: Record<string, unknown>) {
    await this.productReportService.cacheData(TOP_ORDERED_PRODUCTS, data);
  }

  @EventPattern(TOP_ORDERED_PRODUCTS_FROM_YESTERDAY)
  async handleTopOrderedProductsByDate(data: Record<string, unknown>) {
    await this.productReportService.cacheData(
      TOP_ORDERED_PRODUCTS_FROM_YESTERDAY,
      data,
    );
  }
}
