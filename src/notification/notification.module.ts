import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { KafkaConfigService } from '../resources/config/kafka.config';
import { Notification } from '../resources/db/domain/notification.entity';
import { KafkaConsumerService } from './kafka.consumer.service';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  controllers: [NotificationController],
  providers: [NotificationService, KafkaConsumerService, KafkaConfigService],
})
export class NotificationModule {}
