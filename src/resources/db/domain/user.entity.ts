import { Column, Entity, OneToMany } from 'typeorm';
import { Base } from './base.entity';

@Entity('users')
export class User extends Base {
  @Column()
  username: string;
  @Column()
  email: string;
  @Column()
  password: string;
  @Column({ default: 'user' })
  role: string;
}
