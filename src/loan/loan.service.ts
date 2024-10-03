import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '../domain/book.entity';
import { Loan } from '../domain/loan.entity';
import { Repository } from 'typeorm';
import { LoanDTO } from './dto/loan.dto';

@Injectable()
export class LoanService {
  constructor(
    @InjectRepository(Loan)
    private readonly loanRepository: Repository<Loan>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>
  ) { }

  test() {
    return 'test';
  }

  async addLoan(userId: number, bookId: number): Promise<Loan> {
    const bookAvail = await this.bookRepository.findOne({ where: { id: bookId } });
    if (bookAvail.status !== 'available') throw new HttpException('The book is not available for loan! (๑•᎑<๑)ｰ☆', HttpStatus.CONFLICT);
    bookAvail.status = 'borrowed';
    const update = await this.bookRepository.update({ id: bookAvail.id }, bookAvail);
    if (!update.affected) throw new HttpException('update fail! (๑•᎑<๑)ｰ☆', HttpStatus.NOT_FOUND);

    const loan_date = new Date();
    const due_date = new Date();
    due_date.setDate(due_date.getDate() + 14);
    const loan = this.loanRepository.create({
      loan_date: loan_date,
      due_date: due_date,
      user: userId,
      book: bookId
    })
    return await this.loanRepository.save(loan);
  }

  async findLoans(userId: number):Promise<Loan[]> {
    const loans = await this.loanRepository.find({ where: { user: userId }, loadRelationIds: true });
    return loans;
  }

  async findOneLoan(id: number): Promise<Loan> {
    return await this.loanRepository.findOne({ where: { id: id } });;
  }

  async updateLoan(id: number) {
    const loan = await this.loanRepository.findOne({ where: { id: id } });
    const returnDate = new Date();
    if (loan.due_date < returnDate) {
      return await this.loanRepository.update({ id: id }, { return_date: returnDate, status: 'overdue' });
    } else {
      return await this.loanRepository.update({ id: id }, { return_date: returnDate, status: 'returned' });
    }
  }
}
