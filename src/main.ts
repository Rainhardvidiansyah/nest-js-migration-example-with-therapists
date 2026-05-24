import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({whitelist: true}))

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
