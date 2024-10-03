import { Module } from '@nestjs/common';
import { LoanController } from './loan.controller';
import { LoanService } from './loan.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Loan } from '../domain/loan.entity';
import { Book } from '../domain/book.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Loan, Book]),
  ],
  controllers: [LoanController],
  providers: [LoanService]
})
export class LoanModule {}
