import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '../domain/book.entity';
import { Loan } from '../domain/loan.entity';
import { Repository } from 'typeorm';
import { User } from '../domain/user.entity';

@Injectable()
export class LoanService {
  constructor(
    @InjectRepository(Loan)
    private readonly loanRepository: Repository<Loan>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) { }

  /**
   * 대출 등록
   * @param user_id 
   * @param book_id
   */
  async addLoan(userId: number, bookId: number): Promise<Loan> {
    // 대출 가능 확인
    const bookAvail = await this.bookRepository.findOne({ where: { id: bookId } });
    if (bookAvail.status !== 'available') throw new HttpException('The book is not available for loan! (๑•᎑<๑)ｰ☆', HttpStatus.CONFLICT);
    // 책 상태 변경 (대출가능 => 대출중)
    bookAvail.status = 'borrowed';
    await this.bookRepository.update({ id: bookAvail.id }, bookAvail);
    // loan 데이터 추가
    const loan_date = new Date();
    const due_date = new Date();
    due_date.setDate(due_date.getDate() + 14);
    const loan = this.loanRepository.create({
      loan_date: loan_date,
      due_date: due_date,
      user: {id:userId},
      book: {id:bookId}
    })
    return await this.loanRepository.save(loan);
  }

  /**
   * 대출이력 검색
   * @param user_id 
   */
  async findLoans(userId: number): Promise<Loan[]> {
    return await this.loanRepository.find({ where: { user: {id:userId} }, loadRelationIds: true });
  }

  /**
   * 대출 검색
   * @param id 
   */
  async findOneLoan(id: number, userId: number): Promise<Loan> {
    return await this.loanRepository.findOne({ where: { id: id, user: { id: userId } }, loadRelationIds: true });;
  }

  /**
   * 도서 반납
   * @param id 
   */
  async updateLoan(id: number) {
    const loan = await this.loanRepository.findOne({ where: { id: id } });
    const returnDate = new Date();
    // 도서 연체 확인
    if (loan.due_date < returnDate) {
      await this.loanRepository.update({ id: id }, { return_date: returnDate, status: 'overdue' });
    } else {
      await this.loanRepository.update({ id: id }, { return_date: returnDate, status: 'returned' });
    }
    const book = await this.bookRepository.findOne({ where: { id: loan.book.id } });
    return await this.bookRepository.update({ id: book.id }, { status: 'available' });
  }
}