import { Column, Entity, ManyToOne } from "typeorm";
import { Base } from "./base.entity";
import { User } from "./user.entity";
import { Book } from "./book.entity";

@Entity('loans')
export class Loan extends Base {

  @Column({ type: 'date' })
  loan_date: Date // 대여 시작 일자
  @Column({ type: 'date' })
  due_date: Date // 반납 기한 일자
  @Column({ type: 'date' })
  return_date: Date // 실제 반납 일자
  
  // (`on_loan`, `returned`, `overdue`)
  @Column({ default: 'on_loan' })
  status: string;
  @ManyToOne(() => User, (user) => user.id)
  user: number;
  @ManyToOne(() => Book, (book) => book.id)
  book: number;
  
}