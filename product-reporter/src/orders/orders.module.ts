import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersService } from './orders.service';
import { models } from './schemas/models';

@Module({
  controllers: [],
  providers: [OrdersService],
  imports: [MongooseModule.forFeature(models)],
  exports: [OrdersService],
})
export class OrdersModule {}
