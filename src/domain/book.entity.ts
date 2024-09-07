import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Base } from "./base.entity";

@Entity('books')
export class Book extends Base {
    
    @Column()
    username: string;
    @Column()
    password: string;
    @Column()
    email: string;

    //@OneToMany()
    //role: number? any[]?
}