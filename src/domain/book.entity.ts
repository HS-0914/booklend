import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Base } from "./base.entity";

@Entity('books')
export class Book extends Base {

    @Column()
    title: string;
    @Column()
    author: string;
    @Column()
    isbn: string;
    @Column()
    publisher: string;
    @Column({ type: 'date' }) // yyyy-mm-dd 형식으로 저장
    published_date: Date;
    @Column()
    category: string;

    // (`available`, `borrowed`, `reserved`)
    @Column({ default: 'available' })
    status: string;
    @Column({ type: 'text' })
    description: string;

    //@OneToMany()
    //role: number? any[]?
}