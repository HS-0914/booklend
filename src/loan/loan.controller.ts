import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { LoanService } from './loan.service';
import { UserGuard } from '../security/user.guard';
import { Request } from 'express';
import { LoanDTO } from './dto/loan.dto';
import { Loan } from '../domain/loan.entity';

@Controller('loan')
export class LoanController {
  constructor(private loanService:LoanService){};
  
  @Post()
  @UseGuards(UserGuard)
  loanBooks(@Req() req: Request, @Body() loanDTO: LoanDTO): Promise<Loan> {
    return this.loanService.addLoan(req.user.id, loanDTO.bookId);
  }

  @Get()
  @UseGuards(UserGuard)
  async getLoans(@Req() req: Request): Promise<Loan[]> {
    return await this.loanService.findLoans(req.user.id);
  }

  @Get('/:id')
  @UseGuards(UserGuard)
  getOneLoan(@Param('id') id: number): Promise<Loan> {
    return this.loanService.findOneLoan(id);
  }

  @Put('/:id')
  @UseGuards(UserGuard)
  updateLoan(@Param('id') id: number): Promise<any> {
    return this.loanService.updateLoan(id);
  }
}
