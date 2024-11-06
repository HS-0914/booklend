import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { JwtStrategy } from '../security/passport.jwt.strategy';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../domain/user.entity';
import { Book } from '../domain/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Book])],
  controllers: [BookController],
  providers: [BookService, JwtStrategy, UserService],
})
export class BookModule {}
