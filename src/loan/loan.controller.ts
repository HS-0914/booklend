import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { LoanService } from './loan.service';
import { UserGuard } from '../resources/security/user.guard';
import { Request } from 'express';
import { LoanDTO } from './dto/loan.dto';
import { Loan } from '../resources/db/domain/loan.entity';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('loan')
export class LoanController {
  constructor(private loanService: LoanService) {}

  // 도서 대출
  @Post()
  @ApiOperation({ summary: '도서 대출' })
  @ApiResponse({ status: 201, type: Loan })
  @UseGuards(UserGuard)
  async loanBooks(@Req() req: Request, @Body() loanDTO: LoanDTO): Promise<Loan> {
    return await this.loanService.addLoan(req.user.id, loanDTO.bookId);
  }

  // 대출 이력 검색
  @Get()
  @ApiOperation({ summary: '대출 이력 확인' })
  @ApiResponse({ status: 200, type: Loan, isArray: true })
  @UseGuards(UserGuard)
  async getLoans(@Req() req: Request): Promise<Loan[]> {
    return await this.loanService.findLoans(req.user.id);
  }

  // 대출 검색
  @Get('/:id')
  @ApiOperation({ summary: '대출 검색' })
  @ApiResponse({ status: 200, type: Loan })
  @UseGuards(UserGuard)
  async getOneLoan(@Param('id') id: number): Promise<Loan> {
    return await this.loanService.findOneLoan(id);
  }

  // 도서 반납
  @Put('/:id')
  @UseGuards(UserGuard)
  @ApiOperation({ summary: '도서 반납' })
  async updateLoan(@Param('id') id: number): Promise<any> {
    return await this.loanService.updateLoan(id);
  }
}
