import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { KafkaConfigService } from '../kafka.config';
import { Book } from '../resources/db/domain/book.entity';
import { Loan } from '../resources/db/domain/loan.entity';
import { Reservation } from '../resources/db/domain/reservation.entity';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, Loan, Book])],
  controllers: [ReservationController],
  providers: [ReservationService, KafkaConfigService],
})
export class ReservationModule {}
