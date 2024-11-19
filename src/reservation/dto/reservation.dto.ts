import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ReservationDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  bookId: number;
}
