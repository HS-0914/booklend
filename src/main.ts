import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true, // 모든 접근 허용
    credentials: true, // 쿠키 사용
  });
  app.use(cookieParser('SECRET_KEY'));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Booklend API Docs')
    .setDescription('Booklend의 API 문서입니다.')
    .setVersion('1.0')
    .build();
  const docs = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, docs);
  await app.listen(8000);
}
bootstrap();

// https://velog.io/@kwontae1313/NestJS-CORS - nestjs cors 설정
// https?
