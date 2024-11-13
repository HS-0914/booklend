import { User } from '../domain/user.entity';
declare module 'express-serve-static-core' {
  export interface Request {
    user: User; // User 엔티티가 req.user에
  }
}
