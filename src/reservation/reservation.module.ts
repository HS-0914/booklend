import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from '../resources/db/domain/reservation.entity';
import { Book } from '../resources/db/domain/book.entity';
import { Loan } from '../resources/db/domain/loan.entity';
import { KafkaConfigService } from '../kafka.config';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, Loan, Book])],
  controllers: [ReservationController],
  providers: [ReservationService, KafkaConfigService],
})
export class ReservationModule {}
