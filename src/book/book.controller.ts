import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { Book } from '../resources/db/domain/book.entity';
import { RolesGuard } from '../resources/security/role.guard';
import { UserGuard } from '../resources/security/user.guard';
import { SearchType } from '../resources/types/book.type';
import { Roles } from '../resources/types/role.decorator';
import { RoleType } from '../resources/types/role.type';
import { BookService } from './book.service';
import { BookDTO, BookEditDTO } from './dto/book.dto';

@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  // 도서 추가
  @Post('/add')
  @ApiOperation({ summary: '도서 추가' })
  @ApiResponse({ status: 201, type: Book })
  @UseGuards(UserGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  @UsePipes(ValidationPipe)
  async addBook(@Body() bookDTO: BookDTO): Promise<BookDTO> {
    return await this.bookService.registerBook(bookDTO);
  }

  // 도서 검색
  @Get('/search')
  @ApiOperation({ summary: '도서 검색' })
  @ApiResponse({ status: 200, type: Book, isArray: true })
  @ApiQuery({ name: 'type', enum: SearchType, required: false, description: '검색 종류' })
  @ApiQuery({ name: 'search', description: '검색어' })
  async searchBook(
    @Query('type') type: string | null,
    @Query('search') search: string,
    @Query('page') page: number,
  ): Promise<Book[]> {
    return SearchType[type]
      ? await this.bookService.findByType(SearchType[type], search, page)
      : await this.bookService.findAllType(search, page);
  }

  // 도서 상세 검색
  @Get('/search/:id')
  @ApiOperation({ summary: '도서 세부 검색' })
  @ApiResponse({ status: 200, type: Book })
  @ApiQuery({ name: 'id', description: '도서 ID (not isbn)' })
  // ParseIntPipe로 number 전환
  async searchBookDetail(@Param('id', ParseIntPipe) id: number): Promise<Book> {
    return await this.bookService.findByID(id);
  }

  // 인기 도서 검색
  @Get('/popular')
  @ApiOperation({ summary: '주간 인기 도서 Top10' })
  @ApiResponse({ status: 200, type: Book, isArray: true })
  async getTop10Books(): Promise<Book[] | string> {
    return await this.bookService.getTop10Books();
  }

  // 도서 정보 수정
  @Put('/edit/:id')
  @ApiOperation({ summary: '도서 정보 수정' })
  @ApiQuery({ name: 'id', description: '도서 ID (not isbn)' })
  @UseGuards(UserGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  @UsePipes(ValidationPipe)
  async putBook(@Param('id', ParseIntPipe) id: number, @Body() bookDTO: BookEditDTO): Promise<any> {
    return await this.bookService.updateBook(id, bookDTO);
  }

  // 책 삭제
  @Delete('/delete/:id')
  @ApiOperation({ summary: '도서 삭제' })
  @UseGuards(UserGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  async deleteBook(@Param('id', ParseIntPipe) id: number): Promise<Book> {
    return await this.bookService.deleteByID(id);
  }
}
