import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { TOP_ORDERED_PRODUCTS, TOP_PROFITABLE_PRODUCTS } from './conf';
import { ProductReport } from './interfaces';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/products/profit/top')
  async getTopProfitableProducts(): Promise<ProductReport> {
    return await this.appService.getTopProfitable(TOP_PROFITABLE_PRODUCTS);
  }

  @Get('/products/orders-count/top')
  async getTopOrderedProducts(): Promise<ProductReport> {
    return this.appService.getTopOrdered(TOP_ORDERED_PRODUCTS);
  }

  @Get('/products/orders-count-from-yesterday/top')
  async getTopOrderedProductsFromYesterday(): Promise<ProductReport> {
    return this.appService.getTopOrderedFromYesterday();
  }
}
