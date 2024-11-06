import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { LoanService } from './loan.service';
import { UserGuard } from '../security/user.guard';
import { Request } from 'express';
import { LoanDTO } from './dto/loan.dto';
import { Loan } from '../domain/loan.entity';

@Controller('loan')
export class LoanController {
  constructor(private loanService: LoanService) {}

  // 도서 대출
  @Post()
  @UseGuards(UserGuard)
  async loanBooks(@Req() req: Request, @Body() loanDTO: LoanDTO): Promise<Loan> {
    return await this.loanService.addLoan(req.user.id, loanDTO.bookId);
  }

  // 대출 이력 검색
  @Get()
  @UseGuards(UserGuard)
  async getLoans(@Req() req: Request): Promise<Loan[]> {
    return await this.loanService.findLoans(req.user.id);
  }

  // 대출 검색
  @Get('/:id')
  @UseGuards(UserGuard)
  async getOneLoan(@Param('id') id: number): Promise<Loan> {
    return await this.loanService.findOneLoan(id);
  }

  // 도서 반납
  @Put('/:id')
  @UseGuards(UserGuard)
  async updateLoan(@Param('id') id: number): Promise<any> {
    return await this.loanService.updateLoan(id);
  }
}
