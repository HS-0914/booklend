import { SetMetadata } from '@nestjs/common';
import { RoleType } from '../types/role.type';

export const Roles = (...roles: RoleType[]): any => SetMetadata('roles', roles); //roles에 있는것들을 모두 나열
