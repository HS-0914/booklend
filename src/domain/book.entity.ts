import { Column, Entity } from 'typeorm';
import { Base } from './base.entity';

@Entity('books')
export class Book extends Base {
  @Column()
  title: string;
  @Column()
  author: string;
  @Column()
  publisher: string;
  @Column()
  published_year: number;
  @Column() // 권
  volume: number;
  @Column()
  isbn: string;

  /* 
    Korean Decimal Classification
    000 총류, 100 철학, 200 종교, 300 사회과학,
    400 자연과학, 500 기술과학, 600 예술,
    700 언어(어학), 800 문학, 900 역사
    */
  @Column()
  KDC: string;

  // (`available`, `borrowed`, `reserved`)
  @Column({ default: 'available' })
  status: string;
}
