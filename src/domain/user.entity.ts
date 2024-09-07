import { Column, Entity } from "typeorm";
import { Base } from "./base.entity";

@Entity('users')
export class User extends Base {
   
    @Column()
    username: string;
    @Column()
    password: string;
    @Column()
    email: string;

    //@OneToMany()
    //role: number? any[]?
}