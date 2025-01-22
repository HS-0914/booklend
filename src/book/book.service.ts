import { InjectRedis } from '@nestjs-modules/ioredis';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import Redis from 'ioredis';
import { Like, Repository } from 'typeorm';

import { Book } from '../resources/db/domain/book.entity';
import { SearchType } from '../resources/types/book.type';
import { BookDTO, BookEditDTO } from './dto/book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRedis()
    private readonly redis: Redis,
    private env: ConfigService,
  ) {}

  /**
   * 책등록
   * @param bookDTO
   */
  async registerBook(bookDTO: BookDTO): Promise<BookDTO> {
    let bookFind = await this.bookRepository.findOne({ where: { isbn: bookDTO.isbn } });
    if (bookFind) {
      throw new HttpException('Book aleady used! (๑•᎑<๑)ｰ☆', HttpStatus.BAD_REQUEST);
    }
    return await this.bookRepository.save(bookDTO);
  }

  /**
   * 전체 검색
   * @param keyword
   */
  async findAllType(keyword: string): Promise<Book[]> {
    if (keyword) {
      const bookFind = await this.bookRepository.find({
        where: [
          { title: Like(`%${keyword}%`) },
          { author: Like(`%${keyword}%`) },
          { isbn: keyword },
          { publisher: Like(`%${keyword}%`) },
        ],
      });
      return bookFind;
    } else {
      throw new HttpException(`put some search words (๑•᎑<๑)ｰ☆`, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 타입 별 검색
   * @param type
   * @param keyword
   */
  async findByType(type: string, keyword: string): Promise<Book[]> {
    return await this.bookRepository.find({ where: { [type]: Like(`%${keyword}%`) } });
  }

  /**
   * 상세 검색
   * @param id
   */
  async findByID(bookID: number): Promise<Book> {
    const findRedis = await this.redis.get(`book:${bookID}`);
    if (findRedis) {
      const findBook = JSON.parse(findRedis);
      await this.incrementBookScore(findBook);
      return findBook;
    }
    const findBook = await this.bookRepository.findOne({ where: { id: bookID } });
    const redisBook = JSON.stringify(findBook);
    await this.redis.set(`book:${bookID}`, redisBook, 'EX', this.env.get('REDIS_EXPIRE')); // ex = 초, px = 밀리초
    await this.incrementBookScore(findBook);
    return findBook;
  }

  async incrementBookScore(book: Book): Promise<void> {
    const weeklyKey = this.getWeeklyKey();
    const redisBook = JSON.stringify(book);
    await this.redis.zincrby(weeklyKey, 1, redisBook);
  }

  private getWeeklyKey(): string {
    const startOfWeek = new Date();
    // 현재 날짜의 요일을 가져옴 (0: 일요일, 1: 월요일, ..., 6: 토요일)
    const dayOfWeek = startOfWeek.getDay();
    // 이번 주 월요일 (0: 일요일)
    startOfWeek.setDate(startOfWeek.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    const year = startOfWeek.getFullYear();
    const month = startOfWeek.getMonth() + 1;
    const day = startOfWeek.getDay();
    return `weekly:popular:${year}-${month}-${day}`;
  }

  async getTop10Books(): Promise<Book[] | string> {
    const weeklyKey = this.getWeeklyKey();
    const weeklyBooksString = await this.redis.zrevrange(weeklyKey, 0, 9);

    if (weeklyBooksString.length) {
      const weeklyBooks: Book[] = weeklyBooksString.map((e) => {
        return JSON.parse(e);
      });
      return weeklyBooks;
    } else {
      return 'no weekly popular books';
    }
  }

  /**
   * 책 수정
   * @param id
   * @param bookDTO
   */
  async updateBook(bookID: number, bookDTO: BookEditDTO): Promise<any> {
    return await this.bookRepository.update({ id: bookID }, bookDTO);
  }

  /**
   * 책 삭제
   * @param id
   */
  async deleteByID(bookID: number): Promise<Book> {
    const entity = await this.bookRepository.findOne({ where: { id: bookID } });
    if (!entity) throw new HttpException(`Can't found book. id: ${bookID} (๑•᎑<๑)ｰ☆`, HttpStatus.NOT_FOUND);
    return this.bookRepository.remove(entity);
  }
}
