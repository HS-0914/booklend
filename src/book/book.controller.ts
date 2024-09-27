import { Body, Controller, Get, Post, Query, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserGuard } from 'src/security/user.guard';
import { BookDTO } from './dto/book.dto';
import { Response, Request } from 'express';
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

    @Get('/search')
    @UseGuards(UserGuard)
    async searchBook(@Query('type') type: string | null, @Query('search') search: string, @Res() res: Response) {
        console.log(typeof(type));
        const result = type ? await this.bookService.findByType(type, search) : await this.bookService.findAllType(search);
        return res.json({ result: result });
    }
}
