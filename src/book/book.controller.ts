import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Res, UseGuards, UsePipes, ValidationPipe, Put, Delete } from '@nestjs/common';
import { UserGuard } from '../security/user.guard';
import { BookDTO } from './dto/book.dto';
import { Response } from 'express';
import { BookService } from './book.service';
import { Book } from '../domain/book.entity';

@Controller('book')
export class BookController {
    constructor(private bookService: BookService) { };

    // 도서 추가
    @Post('/add')
    @UseGuards(UserGuard)
    @UsePipes(ValidationPipe)
    async addBook(@Body() bookDTO: BookDTO): Promise<BookDTO> {
        return await this.bookService.registerBook(bookDTO);
    }

    // 도서 검색
    @Get('/search')
    @UseGuards(UserGuard)
    async searchBook(@Query('type') type: string | null, @Query('search') search: string, @Res() res: Response): Promise<object> {
        const result = type ? await this.bookService.findByType(type, search) : await this.bookService.findAllType(search);
        return res.json({ result });
    }

    // 도서 상세 검색
    @Get('/search/:id')
    @UseGuards(UserGuard)
    async searchBookDetail(@Param('id', ParseIntPipe) id: number, @Res() res: Response): Promise<object> { // ParseIntPipe로 number 전환
        const result = await this.bookService.findByID(id);
        return res.json({ result });
    }

    // 회원 정보 수정
    @Put('/edit/:id')
    @UseGuards(UserGuard)
    @UsePipes(ValidationPipe)
    async putBook(@Param('id', ParseIntPipe) id: number, @Body() bookDTO: BookDTO): Promise<any> {
        return await this.bookService.updateBook(id, bookDTO);
    }

    // 책 삭제
    @Delete('/delete/:id')
    @UseGuards(UserGuard)
    async deleteBook(@Param('id', ParseIntPipe) id: number): Promise<Book> {
        return await this.bookService.deleteByID(id);
    }
}