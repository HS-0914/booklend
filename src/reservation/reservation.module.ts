import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { KafkaService, ReservationService } from './reservation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from '../domain/reservation.entity';
import { Book } from '../domain/book.entity';
import { Loan } from '../domain/loan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, Loan, Book])],
  controllers: [ReservationController],
  providers: [ReservationService, KafkaService]
})
export class ReservationModule { }