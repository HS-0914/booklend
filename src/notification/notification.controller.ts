import { Controller, Delete, Get, Param, Req, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { UserGuard } from '../security/user.guard';
import { Request } from 'express';
import { Notification } from '../domain/notification.entity';

@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  // 알림 내역 가져오기
  @Get()
  @UseGuards(UserGuard)
  async getAllNotification(@Req() req: Request): Promise<Notification[]> {
    return await this.notificationService.getAllNotification(req.user.id);
  }

  // 알림 내용 가져오기
  @Get(':/id')
  @UseGuards(UserGuard)
  async getOneNotification(@Param('id') id: number): Promise<Notification> {
    return await this.notificationService.getOneNotification(id);
  }
  
  // 알림 삭제하기
  @Delete(':/id')
  @UseGuards(UserGuard)
  async deleteNotification(@Param('id') id: number){
    return await this.notificationService.deleteNotification(id);
  }
}