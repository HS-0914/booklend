import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookStatusType } from 'src/resources/types/book.type';
import { Repository } from 'typeorm';

import { Book } from '../resources/db/domain/book.entity';
import { Loan } from '../resources/db/domain/loan.entity';
import { Reservation } from '../resources/db/domain/reservation.entity';
import { KafkaProducerService } from './kafka.producer.service';

@Injectable()
export class LoanService {
  constructor(
    @InjectRepository(Loan)
    private readonly loanRepository: Repository<Loan>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Reservation)
    private readonly reservRepository: Repository<Reservation>,
    private readonly loanKafka: KafkaProducerService,
  ) {}

  /**
   * 대출 등록
   * @param user_id
   * @param book_id
   */
  async addLoan(userId: number, bookId: number): Promise<Loan> {
    // 대출 가능 확인
    const bookAvail = await this.bookRepository.findOne({
      where: { id: bookId },
    });
    // 예약자 확인
    const resv = await this.reservRepository.findOne({
      where: { book: { id: bookId }, status: 'pending' },
      order: { created_at: 'ASC' },
      relations: ['user'],
    });
    const isUnavailable = bookAvail.status === 'borrowed' || (resv && resv.user.id !== userId);
    if (isUnavailable) throw new HttpException('The book is not available for loan! (๑•᎑<๑)ｰ☆', HttpStatus.CONFLICT);
    // 예약 상태 변경
    if (resv) {
      resv.status = 'completed';
      await this.reservRepository.update({ id: resv.id }, resv);
    }
    // 책 상태 변경 (대출가능 => 대출중)
    bookAvail.status = BookStatusType.BORROWED;
    await this.bookRepository.update({ id: bookAvail.id }, bookAvail);

    // loan 데이터 추가
    const loan_date = new Date();
    const due_date = new Date();
    due_date.setDate(due_date.getDate() + 14);
    const loan = this.loanRepository.create({
      loan_date: loan_date,
      due_date: due_date,
      user: { id: userId },
      book: { id: bookId },
    });
    return await this.loanRepository.save(loan);
  }

  /**
   * 대출이력 검색
   * @param user_id
   */
  async findLoans(userId: number): Promise<Loan[]> {
    return await this.loanRepository.find({
      where: { user: { id: userId } },
      loadRelationIds: { relations: ['book'] },
      order: { created_at: 'ASC' },
    });
  }

  /**
   * 대출 검색
   * @param id
   */
  async findOneLoan(id: number): Promise<Loan> {
    return await this.loanRepository.findOne({
      where: { id: id },
      loadRelationIds: true,
    });
  }

  /**
   * 도서 반납
   * @param id
   */
  async updateLoan(id: number) {
    let loan = await this.loanRepository.findOne({
      where: { id: id },
      relations: ['book'],
    });
    const returnDate = new Date();
    loan.return_date = returnDate;

    // 도서 연체 확인
    loan.status = loan.due_date < returnDate ? 'overdue' : 'returned';

    // 도서 예약 확인
    const resv = await this.reservRepository.findOne({
      where: { book: loan.book, status: 'pending' },
      order: { created_at: 'ASC' },
      relations: ['book', 'user'],
    });
    // loan.book.status = resv ? 'reserved' : 'available';
    loan.book.status = resv ? BookStatusType.RESERVED : BookStatusType.AVAILABLE;

    loan = await this.loanRepository.save(loan);
    await this.bookRepository.update({ id: loan.book.id }, loan.book);
    if (resv) await this.loanKafka.returnBook(resv);
    return loan;
  }
}
