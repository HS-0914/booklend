import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from 'src/domain/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../security/passport.jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'SECRET_KEY',
      signOptions: { expiresIn: '3m' }, // [zeit/ms](https://github.com/zeit/ms.js)."2 days", "10h", "7d", "30s", 120 = 120ms
    }),
    PassportModule
  ],
  exports: [TypeOrmModule],
  controllers: [UserController],
  providers: [UserService, JwtStrategy]
})
export class UserModule {}
