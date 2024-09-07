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
    addBook(@Body() bookDTO: BookDTO, @Res() res: Response) {
        const devvv = this.bookService;
        return 'test';
    }
}
