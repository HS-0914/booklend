import { Body, Controller, Post, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserGuard } from 'src/security/user.guard';
import { BookDTO } from './dto/book.dto';
import { Response } from 'express';
import { BookService } from './book.service';

@Controller('book')
export class BookController {
    constructor(private bookService: BookService){};

    @Post('/add')
    @UseGuards(UserGuard)
    @UsePipes(ValidationPipe)
    async addBook(@Body() bookDTO: BookDTO): Promise<BookDTO> {
        return await this.bookService.registerBook(bookDTO);
    }
}
