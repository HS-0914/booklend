import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Base } from "./base.entity";
import { User } from "./user.entity";
import { Book } from "./book.entity";

@Entity('reservations')
export class Reservation extends Base {

  @Column({ type: 'date' })
  reservation_date: Date; // 도서가 예약된 일자
  @Column({ default: 'pending' })
  status: string;
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;
  @ManyToOne(() => Book, (book) => book.id)
  @JoinColumn({ name: 'book_id' })
  book: Book;
}