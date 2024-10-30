import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from '../domain/notification.entity';
import { KafkaConsumerService } from './kafka.consumer.service';
import { KafkaConfigService } from '../kafka.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    MailerModule.forRoot({
      transport: process.env.SMTP_TRNS,
      defaults: {
        from: '"nest-moduless" <modules@nestjs.com>',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new EjsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, KafkaConsumerService, KafkaConfigService],
})
export class NotificationModule {}
