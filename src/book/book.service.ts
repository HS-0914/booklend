import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
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
    async findAllType(keyword: string) {
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
    async findByType(type: string, keyword: string) {
        return await this.bookRepository.find({ where: { [type]: Like(`%${keyword}%`) } });
    }

    /**
     * 상세 검색
     * @Param id
     */
    async findByID(bookID: number) {
        console.log(bookID, typeof (bookID));
        // return await this.bookRepository.findOne({where: {id: bookID}});
        return await this.bookRepository.findOne({ where: { id: bookID } });
    }

    /**
     * 책 수정
     * @param bookID 
     * @param bookDTO 
     */
    async updateBook(bookID: number, bookDTO: BookDTO) {
        return await this.bookRepository.update({ id: bookID }, bookDTO);
    }

    /**
     * 책 삭제
     * @param bookID 
     */
    async deleteByID(bookID: number): Promise<Book> {
        const entity = await this.bookRepository.findOne({ where: { id: bookID } })
        if (!entity) throw new NotFoundException(`Can't found book. id: ${bookID} (๑•᎑<๑)ｰ☆`)
        return this.bookRepository.remove(entity);
    }
}
