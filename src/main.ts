import { NestFactory, Reflector } from '@nestjs/core';
import { ExpressAdapter as NestExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import basicAuth from 'express-basic-auth';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform-interceptors';
import { ThrottlerExceptionFilter } from './common/filters/throttler-exception.filter';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { Queue } from 'bullmq';
import { QueueName } from './common/constants/queue.constant';

async function bootstrap() {

  const expressApp = express();
  const app = await NestFactory.create(AppModule, new NestExpressAdapter(expressApp));
  
  app.use(cookieParser());

  //BEGIN: BullMQ Dashboard 
  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/admin/queues');

  const connection = {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
  };

  const bullBoardUser = process.env.BULL_BOARD_USER || '';
  const bullBoardPassword = process.env.BULL_BOARD_PASSWORD || '';

  expressApp.use('/admin/queues', basicAuth({
    users: {
      [bullBoardUser]: bullBoardPassword,
    },
    challenge: true
  }));

  createBullBoard({
    queues: Object.values(QueueName).map(
      (name) => new BullMQAdapter(new Queue(name, { connection }))
    ),
    serverAdapter,
  });

  expressApp.use('/admin/queues', serverAdapter.getRouter());
  //END: BullMQ Dashboard

  app.useGlobalInterceptors(
    new TransformInterceptor(app.get(Reflector))
  );

  app.useGlobalFilters(new ThrottlerExceptionFilter());



  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }));


  const port = process.env.PORT || 3000;

  app.setGlobalPrefix('api/v1');

  app.use(
    session({
      secret: 'rahasia-super-aman-123',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'development',
        maxAge: 1000 * 60 * 60 * 2, // 2 jam
        sameSite: 'lax',
      },
    }),
  );

  console.log(`Starting application on port ${port}...`);

  await app.listen(port);

  console.log(`Application is running on: ${await app.getUrl()}`);
}



bootstrap();
