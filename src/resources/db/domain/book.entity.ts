import { Column, Entity } from 'typeorm';
import { Base } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { BookStatusType } from 'src/resources/types/book.type';

@Entity('books')
export class Book extends Base {
  @ApiProperty()
  @Column({ nullable: true })
  title: string;
  @ApiProperty()
  @Column({ nullable: true })
  author: string;
  @ApiProperty()
  @Column({ nullable: true })
  publisher: string;
  @ApiProperty()
  @Column({ nullable: true })
  published_year: string;
  @ApiProperty({ description: '국제표준도서번호' })
  @Column()
  isbn: string;
  @ApiProperty({ description: '권' })
  @Column({ nullable: true }) // 권
  volume: string;

  /* 
    Korean Decimal Classification
    000 총류, 100 철학, 200 종교, 300 사회과학,
    400 자연과학, 500 기술과학, 600 예술,
    700 언어(어학), 800 문학, 900 역사
    */
  @ApiProperty({ description: '한국십진분류법' })
  @Column({ nullable: true })
  kdc: string;

  // (`available`, `borrowed`, `reserved`)
  @ApiProperty({ enum: BookStatusType })
  @Column({ default: 'available' })
  status: BookStatusType;
}
