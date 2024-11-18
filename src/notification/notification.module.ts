import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from '../resources/db/domain/notification.entity';
import { KafkaConsumerService } from './kafka.consumer.service';
import { KafkaConfigService } from '../kafka.config';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  controllers: [NotificationController],
  providers: [NotificationService, KafkaConsumerService, KafkaConfigService],
})
export class NotificationModule {}
