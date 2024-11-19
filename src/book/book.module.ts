import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Book } from '../resources/db/domain/book.entity';
import { User } from '../resources/db/domain/user.entity';
import { JwtStrategy } from '../resources/security/passport.jwt.strategy';
import { UserModule } from '../user/user.module';
import { BookController } from './book.controller';
import { BookService } from './book.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Book]), UserModule],
  controllers: [BookController],
  providers: [BookService, JwtStrategy],
})
export class BookModule {}
