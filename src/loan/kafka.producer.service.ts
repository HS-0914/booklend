import { Injectable } from '@nestjs/common';
import { Producer } from 'kafkajs';

import { KafkaConfigService } from '../kafka.config';
import { Reservation } from '../resources/db/domain/reservation.entity';

@Injectable()
export class KafkaProducerService {
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
