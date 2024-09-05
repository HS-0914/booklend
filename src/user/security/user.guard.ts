import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export class UserGuard extends AuthGuard('jwt'){
    // canActivate() 함수가 true 또는 Promise<true>를 반환했을 때만 해당 요청을 컨트롤러로 전달
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        // console.log('UserGuard : ' + context.switchToHttp().getRequest().headers.authorization)
        return super.canActivate(context);
    }
}