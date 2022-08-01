import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { OrdersModule } from './modules/orders/orders.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  controllers: [],
  imports: [
    OrdersModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.DB_CONNECTION_URL),
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
