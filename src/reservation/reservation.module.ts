import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from '../domain/reservation.entity';
import { Book } from '../domain/book.entity';
import { Loan } from '../domain/loan.entity';
import { User } from '../domain/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, Loan, Book, User])],
  controllers: [ReservationController],
  providers: [ReservationService]
})
export class ReservationModule { }