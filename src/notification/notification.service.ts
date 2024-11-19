import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Notification } from '../resources/db/domain/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notifyRepository: Repository<Notification>,
  ) {}

  /**
   * 알림 내역
   * @param user_id
   */
  async getAllNotification(userId: number): Promise<Notification[]> {
    return await this.notifyRepository.find({
      where: { user: { id: userId } },
      loadRelationIds: { relations: ['book'] },
    });
  }

  /**
   * 알림 내용
   * @param id
   */
  async getOneNotification(id: number): Promise<Notification> {
    return await this.notifyRepository.findOne({
      where: { id: id },
      loadRelationIds: { relations: ['book'] },
    });
  }

  /**
   * 알림 삭제
   * @param id
   */
  async deleteNotification(id: number) {
    return await this.notifyRepository.delete({ id: id });
  }
}
