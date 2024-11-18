import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class Base {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @CreateDateColumn({ type: 'timestamptz' })
  @ApiProperty({ description: '생성일' })
  created_at: Date;
  @UpdateDateColumn({ type: 'timestamptz' })
  @ApiProperty({ description: '수정일' })
  updated_at: Date;
}
