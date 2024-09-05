import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { UserService } from "../user.service";
import { Payload } from "./payload.interface";

// JWT 검증을 위한 파일
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor( private userService:UserService ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false, // 만료 무시?
            secretOrKey: 'SECRET_KEY' // .env
        })
    }

    async validate(payload:Payload, done:VerifiedCallback):Promise<any> { // VerifiedCallback(error: any, user?: unknown | false, info?: any)
        const user = await this.userService.tokenValidateUser(payload);
        if ( !user ) { // 토큰오류, 만료
            return done(new UnauthorizedException({ message: 'user does not exist' }), false)
        }
        return done(null, user);
    }
}