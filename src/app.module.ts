import { RedisModule } from '@nestjs-modules/ioredis';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { LoanModule } from './loan/loan.module';
import { NotificationModule } from './notification/notification.module';
import { ReservationModule } from './reservation/reservation.module';
import { KafkaConfigService } from './resources/config/kafka.config';
import { mailerConfig } from './resources/config/mailer.config';
import { ormConfig } from './resources/config/orm.config';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (env: ConfigService) => ormConfig(env),
      inject: [ConfigService],
    }),
    RedisModule.forRoot({
      type: 'single',
      url: process.env.REDIS_URL,
    }),
    MailerModule.forRootAsync({
      useFactory: (env: ConfigService) => mailerConfig(env),
      inject: [ConfigService],
    }),
    UserModule,
    BookModule,
    LoanModule,
    ReservationModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService, KafkaConfigService],
  exports: [MailerModule],
})
export class AppModule {}
