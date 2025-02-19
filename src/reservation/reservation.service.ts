import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Book } from '../resources/db/domain/book.entity';
import { Loan } from '../resources/db/domain/loan.entity';
import { Reservation } from '../resources/db/domain/reservation.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservRepository: Repository<Reservation>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Loan)
    private readonly loanRepository: Repository<Loan>,
  ) {}

  async createReservation(userId: number, bookId: number) {
    const alreadyLoan = await this.loanRepository.findOne({
      where: {
        user: { id: userId },
        book: { id: bookId },
        status: 'on_loan',
      },
      loadRelationIds: true,
    });
    const findBook = await this.bookRepository.findOne({
      where: { id: bookId },
    });
    if (alreadyLoan || findBook.status !== 'borrowed')
      throw new HttpException('Already loan book or The book is not borrowed! (๑•᎑<๑)ｰ☆', HttpStatus.CONFLICT);
    const reservation_date = new Date();
    const reserv = this.reservRepository.create({
      reservation_date: reservation_date,
      user: { id: userId },
      book: { id: bookId },
    });
    return await this.reservRepository.save(reserv);
  }

  async getAllReservation(userId: number): Promise<Reservation[]> {
    return await this.reservRepository.find({
      where: { user: { id: userId } },
      loadRelationIds: { relations: ['book'] },
    });
  }

  async getOneReservation(id: number, userId: number): Promise<Reservation> {
    return await this.reservRepository.findOne({
      where: { id: id, user: { id: userId } },
      loadRelationIds: true,
    });
  }

  async cancelReservation(id: number): Promise<any> {
    const reserv = await this.reservRepository.findOne({ where: { id: id } });
    if (!reserv) throw new HttpException(`Can't found reservation. id: ${id} (๑•᎑<๑)ｰ☆`, HttpStatus.NOT_FOUND);
    reserv.status = 'canceled';
    return await this.reservRepository.update({ id: reserv.id }, reserv);
  }

  async deleteReservation(id: number): Promise<Reservation> {
    const reserv = await this.reservRepository.findOne({ where: { id: id } });
    if (!reserv) throw new HttpException(`Can't found reservation. id: ${id} (๑•᎑<๑)ｰ☆`, HttpStatus.NOT_FOUND);
    return await this.reservRepository.remove(reserv);
  }
}
