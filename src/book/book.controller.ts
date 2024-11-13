import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Put,
  Delete,
} from '@nestjs/common';
import { UserGuard } from '../security/user.guard';
import { BookDTO } from './dto/book.dto';
import { BookService } from './book.service';
import { Book } from '../domain/book.entity';
import { RoleType } from 'src/types/role.type';
import { Roles } from 'src/user/role.decorator';
import { RolesGuard } from 'src/security/role.guard';

@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  // 도서 추가
  @Post('/add')
  @UseGuards(UserGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  @UsePipes(ValidationPipe)
  async addBook(@Body() bookDTO: BookDTO): Promise<BookDTO> {
    return await this.bookService.registerBook(bookDTO);
  }

  // 도서 검색
  @Get('/search')
  async searchBook(@Query('type') type: string | null, @Query('search') search: string): Promise<Book[]> {
    const result = type ? await this.bookService.findByType(type, search) : await this.bookService.findAllType(search);
    return result;
  }

  // 도서 상세 검색
  @Get('/search/:id')
  // ParseIntPipe로 number 전환
  async searchBookDetail(@Param('id', ParseIntPipe) id: number): Promise<Book> {
    return await this.bookService.findByID(id);
  }

  // 인기 도서 검색
  @Get('/popular')
  async getTop10Books(): Promise<Book[] | string> {
    return await this.bookService.getTop10Books();
  }

  // 도서 정보 수정
  @Put('/edit/:id')
  @UseGuards(UserGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  @UsePipes(ValidationPipe)
  async putBook(@Param('id', ParseIntPipe) id: number, @Body() bookDTO: BookDTO): Promise<any> {
    return await this.bookService.updateBook(id, bookDTO);
  }

  // 책 삭제
  @Delete('/delete/:id')
  @UseGuards(UserGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  async deleteBook(@Param('id', ParseIntPipe) id: number): Promise<Book> {
    return await this.bookService.deleteByID(id);
  }
}
