import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  await app.listen(8000);
}
bootstrap();

// https://blog.naver.com/pjt3591oo/222991359835
// https://velog.io/@dragonsu/Kafka-Kafka-producer-in-Nestjs-2-
// https://velog.io/@atesi/nestjs-마이크로서비스-Kafka-구성하기