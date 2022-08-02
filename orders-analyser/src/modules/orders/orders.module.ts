import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { OrderController } from './order.controller';
import { OrdersService } from './orders.service';
import { models } from './schemas/models';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { OrdersCreatedHandler } from '../../events/handlers/orders-created.handler';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PRODUCT_REPORTER_SERVICE } from '../../conf';
import { ProfitCounter } from '../../events/triggers/profit-counter';
import { OrdersCounterByDate } from '../../events/triggers/orders-counter-by-date.service';

@Module({
  controllers: [OrderController],
  providers: [
    OrdersService,
    OrdersCreatedHandler,
    ProfitCounter,
    OrdersCounterByDate,
  ],
  imports: [
    ClientsModule.register([
      {
        name: PRODUCT_REPORTER_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.MQ_URL],
          queue: 'orders_report_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    HttpModule,
    EventEmitterModule.forRoot(),
    MongooseModule.forFeature(models),
  ],
})
export class OrdersModule {}
