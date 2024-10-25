import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '../domain/book.entity';
import { Loan } from '../domain/loan.entity';
import { Repository } from 'typeorm';
import { KafkaProducerService } from './kafka.producer.service';
import { Reservation } from 'src/domain/reservation.entity';

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
    if (bookAvail.status !== 'available')
      throw new HttpException(
        'The book is not available for loan! (๑•᎑<๑)ｰ☆',
        HttpStatus.CONFLICT,
      );
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
      loadRelationIds: true,
      order: { created_at: 'ASC' },
    });
  }

  /**
   * 대출 검색
   * @param id
   */
  async findOneLoan(id: number, userId: number): Promise<Loan> {
    return await this.loanRepository.findOne({
      where: { id: id, user: { id: userId } },
      loadRelationIds: true,
    });
  }

  /**
   * 도서 반납
   * @param id
   */
  async updateLoan(id: number) {
    let loan = await this.loanRepository.findOne({ where: { id: id } });
    const returnDate = new Date();
    loan.return_date = returnDate;

    // 도서 연체 확인
    if (loan.due_date < returnDate) {
      loan.status = 'overdue';
    } else {
      loan.status = 'returned';
    }
    const resv = await this.reservRepository.findOne({
      where: { book: loan.book, status: 'pending' },
      order: { created_at: 'ASC' },
    });

    if (resv) { // 예약 있음
      loan.book.status = 'reserved';
    } else { // 예약 없음
      loan.book.status = 'available';
    }
    loan = await this.loanRepository.save(loan);
    const updateBook = await this.bookRepository.save(loan.book);
    await this.loanKafka.returnBook(resv);

    return updateBook;
  }
}