import { Column, Entity } from "typeorm";
import { Base } from "./base.entity";

@Entity('reservations')
export class Reservation extends Base {
  
  @Column({ type: 'date' })
  reservation_date: Date; // 도서가 예약된 일자
  @Column({ default: 'pending' })
  status: string;
}

// - **id** (UUID 또는 Number, Primary Key): 고유 예약 기록 ID.
// - **user_id** (UUID 또는 Number, Foreign Key): 예약한 사용자 ID.
// - **book_id** (UUID 또는 Number, Foreign Key): 예약된 도서 ID.
// - **reservation_date** (Date): 도서가 예약된 일시.
// - **status** (String): 예약 상태 (예: `pending`, `notified`, `completed`, `canceled`).
// - **created_at** (Date): 예약 기록 생성 일시.
// - **updated_at** (Date): 예약 기록 마지막 수정 일시.
