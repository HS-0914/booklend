import { Injectable } from '@nestjs/common';
import { KafkaConfigService } from '../kafka.config';
import { Consumer, EachMessagePayload } from 'kafkajs';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from '../domain/notification.entity';
import { Repository } from 'typeorm';
import { Reservation } from 'src/domain/reservation.entity';

@Injectable()
export class KafkaConsumerService {
  private consumer: Consumer;

  constructor(
    private kafkaconf: KafkaConfigService,
    @InjectRepository(Notification)
    private readonly notifyRepository: Repository<Notification>,
  ) {
    this.consumer = this.kafkaconf
      .getKafka()
      .consumer({ groupId: 'book-group' });
    this.consumer.connect();
    this.consumer.subscribe({ topic: 'book-events' });
    this.consumer.run({
      // eachMessage: this.consumerCallback.bind(this), // 위 아래 둘다 ㄱㄴ
      eachMessage: async (payload: EachMessagePayload) => {
        this.consumerCallback(payload);
      },
    });
  }
  async consumerCallback(payload: EachMessagePayload): Promise<void> {
    console.log('kafka message arrived (๑•᎑<๑)ｰ☆');
    console.log(
      `topic: ${payload.topic}, Msg: ${payload.message.value.toString()}, partition: ${payload.partition}, key: ${payload.message.key.toString()}`,
    );
    // 알림 보내는 기능

    // 알림 보낸 뒤
    const today = new Date();
    const userId = +payload.message.key.toString();
    const reserv = JSON.parse(payload.message.value.toString()).reserv;
    const createNotification: Notification = this.notifyRepository.create({
      type: 'reservation_ready',
      message: '예약된 도서가 반납됐습니다. 일정 기간 내 대여해주세요.',
      sent_at: today,
      user: { id: userId },
      book: { id: reserv.book },
    });
    console.log(createNotification);
    await this.notifyRepository.save(createNotification);
  }
}