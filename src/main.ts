import 'dotenv/config';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  // Gelen isteklerin DTO kurallarına göre doğrulanmasını sağlar.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO içerisinde tanımlanmayan alanları temizler.
      forbidNonWhitelisted: true, // Tanımlanmayan alan gönderilirse isteği reddeder.
      transform: true, // Gelen verileri DTO tiplerine dönüştürür.
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
