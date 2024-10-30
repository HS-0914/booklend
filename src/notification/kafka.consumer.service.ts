import { Injectable } from '@nestjs/common';
import { KafkaConfigService } from '../kafka.config';
import { Consumer, EachMessagePayload } from 'kafkajs';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from '../domain/notification.entity';
import { Repository } from 'typeorm';
import { Reservation } from 'src/domain/reservation.entity';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class KafkaConsumerService {
  private consumer: Consumer;

  constructor(
    private kafkaconf: KafkaConfigService,
    @InjectRepository(Notification)
    private readonly notifyRepository: Repository<Notification>,
    private readonly mail: MailerService,
  ) {
    this.consumer = this.kafkaconf.getKafka().consumer({ groupId: 'book-group' });
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

    const today = new Date();
    const userId = +payload.message.key.toString();
    const reserv: Reservation = JSON.parse(payload.message.value.toString()).reserv;

    // 알림 내역 생성
    const createNotification: Notification = this.notifyRepository.create({
      type: 'reservation_ready',
      message: '예약된 도서가 반납됐습니다. 일정 기간 내 대여해주세요.',
      sent_at: today,
      user: { id: userId },
      book: reserv.book,
    });

    const notification = await this.notifyRepository.save(createNotification);
    // 알림 보내는 기능
    await this.sendMail(notification);
  }

  async sendMail(notification: Notification) {
    const msg: string = notification.message;
    const title: string = notification.book.title;

    console.log(msg);
    console.log(title);
    await this.mail.sendMail({
      to: notification.user.email,
      subject: '도서 예약 알림',
      template: './email',
      context: {
        message: msg,
        book: title,
        // notification: JSON.stringify({ notification }),
      },
    });
  }
}
