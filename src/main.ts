import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const env = app.get(ConfigService);

  app.enableCors({
    origin: true, // 모든 접근 허용
    credentials: true, // 쿠키 사용
  });
  app.use(cookieParser(env.get<string>('COOKIE_SECRET')));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Booklend API Docs')
    .setDescription('Booklend의 API 문서입니다.')
    .setVersion(env.get<string>('SWAGGER_VERSION'))
    .build();
  const docs = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, docs);

  const port = env.get<number>('PORT');
  await app.listen(port);
  console.log('run...........');
}
bootstrap();

// https://velog.io/@kwontae1313/NestJS-CORS - nestjs cors 설정
// configuration - https://cdragon.tistory.com/entry/NestJS-Configuration-%EC%82%AC%EC%9A%A9%EB%B2%95
