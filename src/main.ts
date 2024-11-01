import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true, // 모든 접근 허용
    credentials: true, // 쿠키 사용
    exposedHeaders: ['Authorization'],
  });
  app.use(cookieParser());
  await app.listen(8000);
}
bootstrap();

// https://velog.io/@kwontae1313/NestJS-CORS - nestjs cors 설정
