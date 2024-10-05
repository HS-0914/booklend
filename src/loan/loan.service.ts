import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '../domain/book.entity';
import { Loan } from '../domain/loan.entity';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class LoanService {
  constructor(
    @InjectRepository(Loan)
    private readonly loanRepository: Repository<Loan>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>
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
    const update = await this.bookRepository.update({ id: bookAvail.id }, bookAvail);
    if (!update.affected) throw new HttpException('update fail! (๑•᎑<๑)ｰ☆', HttpStatus.NOT_FOUND);
    // loan 데이터 추가
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

  /**
   * 대출이력 검색
   * @param user_id 
   */
  async findLoans(userId: number): Promise<Loan[]> {
    return await this.loanRepository.find({ where: { user: userId }, loadRelationIds: true });
  }

  /**
   * 대출 검색
   * @param id 
   */
  async findOneLoan(id: number): Promise<Loan> {
    return await this.loanRepository.findOne({ where: { id: id }, loadRelationIds: true });;
  }

  /**
   * 도서 반납
   * @param id 
   */
  async updateLoan(id: number) {
    const loan = await this.loanRepository.findOne({ where: { id: id } });
    const returnDate = new Date();
    let result: UpdateResult;
    // 도서 연체 확인
    if (loan.due_date < returnDate) {
      result = await this.loanRepository.update({ id: id }, { return_date: returnDate, status: 'overdue' });
    } else {
      result = await this.loanRepository.update({ id: id }, { return_date: returnDate, status: 'returned' });
    }
    if (!result.affected) throw new HttpException('update fail! (๑•᎑<๑)ｰ☆', HttpStatus.NOT_FOUND);
    const book = await this.bookRepository.findOne({ where: { id: loan.book } });
    return await this.bookRepository.update({ id: book.id }, { status: 'available' });
  }
}