import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { BookModule } from './book/book.module';
import { LoanModule } from './loan/loan.module';
import { ReservationModule } from './reservation/reservation.module';
import { NotificationModule } from './notification/notification.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '@nestjs-modules/ioredis';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { KafkaConfigService } from './kafka.config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      entities: [__dirname + '/domain/*.entity.{ts,js}'],
      synchronize: true,
    }),
    RedisModule.forRoot({
      type: 'single',
      url: process.env.REDIS_URL,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASS,
        },
      },
      defaults: {
        from: `"booklend" <${process.env.SMTP_EMAIL}>`,
      },
      template: {
        dir: __dirname + '/resources/templates',
        adapter: new EjsAdapter(),
        options: {
          strict: true,
        },
      },
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
