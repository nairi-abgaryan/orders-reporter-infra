import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import {
  TOP_ORDERED_PRODUCTS,
  TOP_ORDERED_PRODUCTS_FROM_YESTERDAY,
} from './conf';
import { OrdersService } from './orders/orders.service';

@Injectable()
export class AppService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly orderService: OrdersService,
  ) {}

  async cacheData(key: string, data): Promise<any> {
    return this.cacheManager.get(key, data);
  }

  async getTopProfitable(key: string): Promise<any> {
    let topProducts = await this.cacheManager.get(key);
    if (topProducts !== null) return topProducts;

    topProducts = await this.orderService.topProfitable();
    try {
      await this.cacheManager.set(TOP_ORDERED_PRODUCTS, topProducts);
      console.log(topProducts);
    } catch (e) {
      console.log(e);
    }

    return topProducts;
  }

  async getTopOrdered(key: string): Promise<any> {
    console.log(await this.cacheManager.store.get(TOP_ORDERED_PRODUCTS));
    let topProducts = await this.cacheManager.get(key);
    if (topProducts !== null) return topProducts;

    topProducts = await this.orderService.topOrdered();
    await this.cacheManager.set(TOP_ORDERED_PRODUCTS, topProducts);

    return topProducts;
  }

  async getTopOrderedFromYesterday(): Promise<any> {
    const topProducts = await this.cacheManager.get(
      TOP_ORDERED_PRODUCTS_FROM_YESTERDAY,
    );
    if (topProducts !== null) return topProducts;

    return await this.orderService.topOrderedByDate(1);
  }
}
