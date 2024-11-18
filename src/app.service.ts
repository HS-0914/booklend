import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaConfigService } from './kafka.config';
import { Admin } from 'kafkajs';
@Injectable()
export class AppService {
  private admin: Admin;
  constructor(private kafkaconfig: KafkaConfigService) {
    console.log('create topic');
    this.admin = this.kafkaconfig.getKafka().admin();
    this.admin.createTopics({
      topics: [{ topic: 'book-events' }],
    });
  }
}
