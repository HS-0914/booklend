import { IsISO8601, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BookDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  author: string;

  @IsNotEmpty()
  @IsString()
  isbn: string;

  @IsNotEmpty()
  @IsString()
  publisher: string;

  @IsNotEmpty()
  // @IsDate() 데코레이터는 날짜 형식을 지정하지 않음, 이 데코레이터는 단순히 값이 Date 객체인지 검사
  @IsISO8601()
  published_date: Date;

  @IsNotEmpty()
  @IsString()
  category: string;

  // (`available`, `borrowed`, `reserved`)
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  status: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description: string;
}
