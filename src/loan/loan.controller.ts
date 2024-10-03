import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LoanService } from './loan.service';
import { UserGuard } from 'src/security/user.guard';
import { Request } from 'express';

@Controller('loan')
export class LoanController {
  constructor(private loanService:LoanService){};
  
  @Post()
  @UseGuards(UserGuard)
  loanBooks(@Req() req: Request, @Body() loanDTO: any){
    console.log(typeof(req.user));
    // return this.loanService.addLoan(req.user, 2);
  }

}
