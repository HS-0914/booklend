import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { JwtStrategy } from '../resources/security/passport.jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../resources/db/domain/user.entity';
import { Book } from '../resources/db/domain/book.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Book]), UserModule],
  controllers: [BookController],
  providers: [BookService, JwtStrategy],
})
export class BookModule {}
