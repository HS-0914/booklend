import { IsNotEmpty, IsNumber } from 'class-validator';

export class ReservationDTO {
  @IsNotEmpty()
  @IsNumber()
  bookId: number;
}
