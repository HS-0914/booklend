import { User } from "../domain/user.entity";

declare global {
  namespace Express {
    interface Request {
      user: User; // User 엔티티가 req.user에
    }
  }
}