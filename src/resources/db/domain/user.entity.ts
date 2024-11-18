import { Column, Entity, OneToMany } from 'typeorm';
import { Base } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User extends Base {
  @Column()
  @ApiProperty()
  username: string;
  @Column()
  @ApiProperty()
  email: string;
  @Column()
  @ApiProperty()
  password: string;
  @Column({ default: 'user' })
  @ApiProperty({ description: '권한', default: 'user' })
  role: string;
  @Column()
  @ApiProperty({ description: '인증여부' })
  verification: string;
}
