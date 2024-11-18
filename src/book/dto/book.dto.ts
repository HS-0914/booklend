import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BookDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  author: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  publisher: string;

  @ApiProperty()
  @IsNotEmpty()
  // @IsDate() 데코레이터는 날짜 형식을 지정하지 않음, 이 데코레이터는 단순히 값이 Date 객체인지 검사
  @IsISO8601()
  published_date: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  isbn: string;

  @ApiProperty()
  @IsString()
  volume: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  kdc: string;
}
