import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/domain/book.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { BookDTO } from './dto/book.dto';

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>
    ){}

    async registerBook(bookDTO: BookDTO): Promise<BookDTO> {
        let bookFind = await this.findByFields({ where: { isbn: bookDTO.isbn }});
        if(bookFind) {
            throw new HttpException('book aleady used!', HttpStatus.BAD_REQUEST);
        }
        return await this.bookRepository.save(bookDTO);
    }

    private async findByFields(options: FindOneOptions<Book>): Promise<Book | undefined> {
        return await this.bookRepository.findOne(options);
    }
}
