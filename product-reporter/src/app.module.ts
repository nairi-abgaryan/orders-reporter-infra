import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReportsModule } from './events/reports.module';
import { CacheModule, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { OrdersModule } from './orders/orders.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

console.log(process.env.DB_CONNECTION_URL);
@Module({
  imports: [
    OrdersModule,
    ReportsModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      url: process.env.REDIS_URL,
    }),

    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.DB_CONNECTION_URL),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
