import { Injectable } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class KafkaConfigService {
  private kafka: Kafka;
  constructor() {
    this.kafka = new Kafka({
      clientId: 'booklend kafka',
      brokers: ['kafka:9092'],
    });
  }
  getKafka(): Kafka {
    return this.kafka;
  }
}
