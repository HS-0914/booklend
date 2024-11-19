import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class LoanDTO {
  @ApiProperty({ description: 'Book ID (not isbn)' })
  @IsNotEmpty()
  @IsNumber()
  bookId: number;
}
