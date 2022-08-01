import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductReportService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async cacheData(key: string, data): Promise<void> {
    await this.cacheManager.set(key, data);
    console.log('Caching data from reporter');
  }
}
