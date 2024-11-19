import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../resources/db/domain/user.entity';
import { JwtStrategy } from '../resources/security/passport.jwt.strategy';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigService],
      useFactory: async (env: ConfigService) => ({
        secret: env.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: env.get<string>('JWT_EXPIRE') }, // [zeit/ms](https://github.com/zeit/ms.js)."2 days", "10h", "7d", "30s", 120 = 120ms
      }),
      inject: [ConfigService],
    }),
    PassportModule,
  ],
  exports: [TypeOrmModule, UserService],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
})
export class UserModule {}
