import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;
    @Column()
    password: string;
    @Column()
    email: string;

    //@OneToMany()
    //role: number? any[]?
}