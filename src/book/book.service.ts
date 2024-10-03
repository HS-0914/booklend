import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/domain/book.entity';
import { Like, Repository } from 'typeorm';
import { BookDTO } from './dto/book.dto';

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>
    ) { }

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
                { publisher: Like(`%${keyword}%`) }
            ]
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
     * @Param id
     */
    async findByID(bookID: number): Promise<Book> {
        return await this.bookRepository.findOne({ where: { id: bookID } });
    }

    /**
     * 책 수정
     * @param bookID 
     * @param bookDTO 
     */
    async updateBook(bookID: number, bookDTO: BookDTO): Promise<any> {
        return await this.bookRepository.update({ id: bookID }, bookDTO);
    }

    /**
     * 책 삭제
     * @param bookID 
     */
    async deleteByID(bookID: number): Promise<Book> {
        const entity = await this.bookRepository.findOne({ where: { id: bookID } })
        if (!entity) throw new HttpException(`Can't found book. id: ${bookID} (๑•᎑<๑)ｰ☆`, HttpStatus.NOT_FOUND);
        return this.bookRepository.remove(entity);
    }
}
