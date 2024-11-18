import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { UserService } from '../../user/user.service';
import { Payload } from './payload.interface';
import { Request } from 'express';

// JWT 검증을 위한 Class 파일
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      // 쿠키에서 token 추출
      // ExtractJwt.fromAuthHeaderAsBearerToken() -> Request에서 JWT를 Header에 Bearer Token에서 추출
      jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => req?.signedCookies?.jwt]),
      ignoreExpiration: true, // 만료 무시?
      secretOrKey: 'SECRET_KEY', // .env
    });
  }

  // JwtStrategy에서 반환된 유저 정보가 request.user에 들어감
  async validate(payload: Payload, done: VerifiedCallback): Promise<any> {
    const user = await this.userService.tokenValidateUser(payload);
    if (!user) {
      // 토큰오류, 만료
      return done(new UnauthorizedException({ message: 'User does not exist (๑•᎑<๑)ｰ☆' }), false);
    }
    if (user.verification !== 'verified') {
      return done(new UnauthorizedException({ message: 'Need to verify (๑•᎑<๑)ｰ☆' }), false);
    }
    delete user.password;
    return done(null, user); // 이 user 객체가 request.user에 들어감
  }
}
