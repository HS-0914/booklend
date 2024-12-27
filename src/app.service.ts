import { Injectable } from '@nestjs/common';
import { Admin } from 'kafkajs';

import { KafkaConfigService } from './resources/config/kafka.config';

@Injectable()
export class AppService {
  private admin: Admin;
  constructor(private kafkaconfig: KafkaConfigService) {
    // console.log('create topic');
    this.admin = this.kafkaconfig.getKafka().admin();
    this.admin.createTopics({
      topics: [{ topic: 'book-events' }],
    });
  }
}
