import { IsNotEmpty, IsNumber } from "class-validator";

export class LoanDTO {

  @IsNotEmpty()
  @IsNumber()
  bookId: number;
  
}