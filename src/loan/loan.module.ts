import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { KafkaConfigService } from '../resources/config/kafka.config';
import { Book } from '../resources/db/domain/book.entity';
import { Loan } from '../resources/db/domain/loan.entity';
import { Reservation } from '../resources/db/domain/reservation.entity';
import { KafkaProducerService } from './kafka.producer.service';
import { LoanController } from './loan.controller';
import { LoanService } from './loan.service';

@Module({
  imports: [TypeOrmModule.forFeature([Loan, Book, Reservation])],
  controllers: [LoanController],
  providers: [LoanService, KafkaProducerService, KafkaConfigService],
})
export class LoanModule {}
