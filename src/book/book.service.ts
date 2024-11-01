import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '../domain/book.entity';
import { Like, Repository } from 'typeorm';
import { BookDTO } from './dto/book.dto';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRedis()
    private readonly redis: Redis,
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
    const bookFind = await this.bookRepository.find({
      where: [
        { title: Like(`%${keyword}%`) },
        { author: Like(`%${keyword}%`) },
        { isbn: keyword },
        { publisher: Like(`%${keyword}%`) },
      ],
    });
    return bookFind;
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
      console.log('isRedis, return redis');
      const redisBook: Book = JSON.parse(findRedis);
      console.log(redisBook);
      return redisBook;
    }
    const findBook = await this.bookRepository.findOne({ where: { id: bookID } });
    await this.redis.hset(`book:${bookID}`, findBook);
    await this.redis.expire(`book:${bookID}`, 100);
    return findBook;
  }

  /**
   * 책 수정
   * @param id
   * @param bookDTO
   */
  async updateBook(bookID: number, bookDTO: BookDTO): Promise<any> {
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
