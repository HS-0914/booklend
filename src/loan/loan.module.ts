import { Module } from '@nestjs/common';
import { LoanController } from './loan.controller';
import { LoanService } from './loan.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Loan } from '../resources/db/domain/loan.entity';
import { Book } from '../resources/db/domain/book.entity';
import { Reservation } from '../resources/db/domain/reservation.entity';
import { KafkaProducerService } from './kafka.producer.service';
import { KafkaConfigService } from '../kafka.config';

@Module({
  imports: [TypeOrmModule.forFeature([Loan, Book, Reservation])],
  controllers: [LoanController],
  providers: [LoanService, KafkaProducerService, KafkaConfigService],
})
export class LoanModule {}
