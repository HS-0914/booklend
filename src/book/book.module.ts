import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { JwtStrategy } from '../security/passport.jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../domain/user.entity';
import { Book } from '../domain/book.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Book]), UserModule],
  controllers: [BookController],
  providers: [BookService, JwtStrategy],
})
export class BookModule {}
