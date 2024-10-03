import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Loan } from 'src/domain/loan.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LoanService {
  constructor(
    @InjectRepository(Loan)
    private readonly loanRepository: Repository<Loan>
  ){}

  test(){
    return 'test';
  }

  addLoan(user: number, bookId: number){
    console.log(`${typeof(user)}, ${typeof(bookId)}`)
    return 'd';
  }
}
