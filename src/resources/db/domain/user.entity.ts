import { Column, Entity, OneToMany } from 'typeorm';
import { Base } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User extends Base {
  @ApiProperty()
  @Column()
  username: string;
  @ApiProperty()
  @Column()
  email: string;
  @ApiProperty()
  @Exclude()
  @Column()
  password: string;
  @ApiProperty({ description: '권한', default: 'user' })
  @Column({ default: 'user' })
  role: string;
  @ApiProperty({ description: '인증여부' })
  @Column()
  verification: string;
}
