import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from '../domain/reservation.entity';
import { Repository } from 'typeorm';
import { Book } from '../domain/book.entity';
import { Loan } from '../domain/loan.entity';
import { Consumer, EachMessagePayload, Kafka } from 'kafkajs';
import { KafkaConfigService } from 'src/kafka.config';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservRepository: Repository<Reservation>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Loan)
    private readonly loanRepository: Repository<Loan>,
  ) {}

  async createReservation(userId: number, bookId: number) {
    const alreadyLoan = await this.loanRepository.findOne({
      where: {
        user: { id: userId },
        book: { id: bookId },
      },
      loadRelationIds: true,
    });
    const findBook = await this.bookRepository.findOne({
      where: { id: bookId },
    });
    if (alreadyLoan || findBook.status !== 'borrowed')
      throw new HttpException(
        'Already loan book or The book is not borrowed! (๑•᎑<๑)ｰ☆',
        HttpStatus.CONFLICT,
      );
    const reservation_date = new Date();
    const reserv = this.reservRepository.create({
      reservation_date: reservation_date,
      user: { id: userId },
      book: { id: bookId },
    });
    return await this.reservRepository.save(reserv);
  }

  async getAllReservation(userId: number): Promise<Reservation[]> {
    return await this.reservRepository.find({
      where: { user: { id: userId } },
      loadRelationIds: true,
    });
  }

  async getOneReservation(id: number, userId: number): Promise<Reservation> {
    return await this.reservRepository.findOne({
      where: { id: id, user: { id: userId } },
      loadRelationIds: true,
    });
  }

  async deleteReservation(id: number): Promise<Reservation> {
    const reserv = await this.reservRepository.findOne({ where: { id: id } });
    if (!reserv)
      throw new HttpException(
        `Can't found reservation. id: ${id} (๑•᎑<๑)ｰ☆`,
        HttpStatus.NOT_FOUND,
      );
    return await this.reservRepository.remove(reserv);
  }
}

@Injectable()
export class KafkaService {
  private consumer: Consumer;
  constructor(private readonly kafka: KafkaConfigService) {
    this.consumer = this.kafka
      .getKafka()
      .consumer({ groupId: 'kafka booklend group' });
    this.consumer.connect();
    this.consumer.subscribe({ topic: 'book-events' });
    this.consumer.run({
      eachMessage: this.consumerCallback,
    });
  }

  async consumerCallback(payload: EachMessagePayload) {
    console.log('kafka message arrived (๑•᎑<๑)ｰ☆');
    console.log(
      `topic: ${payload.topic}, Msg: ${payload.message.value.toString()}, partition: ${payload.partition}, key: ${payload.message.key.toString()}`,
    );
  }

  async addSubscriptionTopic(topic: string) {}
}