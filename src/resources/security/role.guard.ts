import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from '../db/domain/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {} //Reflector -> runtime 시에 메타데이터를 가져올수있게 해주는것
  // canActivate() 함수가 true 또는 Promise<true>를 반환했을 때만 해당 요청을 컨트롤러로 전달
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRole = this.reflector.get<string[]>('roles', context.getHandler()); // context.getHandler를 읽어올수있음
    if (!requiredRole) return true;

    const request = context.switchToHttp().getRequest();
    const user: User = request.user; //passport.jwt.strategy에 validate()에서 넘어온 user

    return user && user.role && requiredRole.some((role) => this.checkRole(user.role, role));
  }
  private checkRole(userRole: string, requiredRole: string): boolean {
    const role = {
      root: 3,
      admin: 2,
      user: 1,
    };
    // 역할 순위를 비교하여 최소 요구 역할 이상이면 true 반환
    return role[userRole] >= role[requiredRole];
  }
}
