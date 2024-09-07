import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { JwtStrategy } from '../security/passport.jwt.strategy';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../domain/user.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    // PassportModule
  ],
  // exports: [TypeOrmModule],
  controllers: [BookController],
  providers: [BookService, JwtStrategy, UserService]
})
export class BookModule {}
 