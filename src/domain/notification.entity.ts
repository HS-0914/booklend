import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Base } from "./base.entity";
import { User } from "./user.entity";
import { Book } from "./book.entity";

@Entity('notifications')
export class Notification extends Base {
  @Column()
  type: string;
  @Column()
  message: string;
  @Column({ type: 'date' })
  sent_at: Date; // 알림이 발송된 일자

  // (예: `sent`, `pending`, `failed`)
  @Column({ default: 'sent' })
  status: string;
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;
  @ManyToOne(() => Book, (book) => book.id)
  @JoinColumn({ name: 'book_id' })
  book: Book;
}