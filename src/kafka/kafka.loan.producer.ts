import { Injectable } from '@nestjs/common';
import { KafkaConfigService } from './kafka.config';
import { Producer } from 'kafkajs';
import { Reservation } from '../domain/reservation.entity';

@Injectable()
export class KafkaLoanProducer {
  private producer: Producer;

  constructor(private kafkaconf: KafkaConfigService) {
    this.producer = this.kafkaconf.getKafka().producer();
    this.producer.connect();
  }
  async returnBook(reserv: Reservation) {
    await this.producer.send({
      topic: 'book-events',
      messages: [
        {
          key: `${reserv.user}`,
          value: JSON.stringify({
            reserv,
          }),
        },
      ],
    });
  }
}