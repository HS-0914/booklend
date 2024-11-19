import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsISBN, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BookStatusType } from 'src/resources/types/book.type';

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

  @ApiProperty({ example: '2024' })
  @IsNotEmpty()
  // @IsDate() 데코레이터는 날짜 형식을 지정하지 않음, 이 데코레이터는 단순히 값이 Date 객체인지 검사
  @IsString()
  published_date: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsISBN()
  isbn: string;

  @ApiProperty()
  @IsString()
  volume: string;

  @ApiProperty()
  @IsString()
  kdc: string;

  @ApiProperty({ required: false, enum: BookStatusType })
  @IsEnum(BookStatusType)
  status: BookStatusType;
}

export class BookEditDTO {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  author: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  publisher: string;

  @ApiProperty({ required: false, example: '2024' })
  @IsOptional()
  @IsNotEmpty()
  // @IsDate() 데코레이터는 날짜 형식을 지정하지 않음, 이 데코레이터는 단순히 값이 Date 객체인지 검사
  @IsString()
  published_date: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsISBN()
  isbn: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  volume: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  kdc: string;

  @ApiProperty({ required: false, enum: BookStatusType })
  @IsOptional()
  @IsEnum(BookStatusType)
  status: BookStatusType;
}
