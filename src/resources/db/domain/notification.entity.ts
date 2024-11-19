import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from './base.entity';
import { User } from './user.entity';
import { Book } from './book.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('notifications')
export class Notification extends Base {
  @ApiProperty()
  @Column()
  type: string;
  @ApiProperty()
  @Column()
  message: string;
  @ApiProperty()
  @Column({ type: 'date' })
  sent_at: Date; // 알림이 발송된 일자

  // (예: `sent`, `pending`, `failed`)
  @ApiProperty()
  @Column({ default: 'sent' })
  status: string;
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;
  @ManyToOne(() => Book, (book) => book.id)
  @JoinColumn({ name: 'book_id' })
  book: Book;
}
