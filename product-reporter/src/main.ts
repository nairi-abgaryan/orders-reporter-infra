import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  console.log(process.env.MQ_URL + 'dsadsa');
  const microserviceApp =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.MQ_URL],
        queue: 'orders_report_queue',
        queueOptions: {
          durable: false,
        },
      },
    });

  await microserviceApp.listen();
  await app.listen(3001);
}

bootstrap();
