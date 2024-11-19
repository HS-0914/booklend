import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka } from 'kafkajs';

@Injectable()
export class KafkaConfigService {
  private kafka: Kafka;
  constructor(env: ConfigService) {
    this.kafka = new Kafka({
      clientId: env.get<string>('KAFKA_CLIENTID'),
      brokers: [env.get<string>('KAFKA_BROKERS')],
    });
  }
  getKafka(): Kafka {
    return this.kafka;
  }
}
