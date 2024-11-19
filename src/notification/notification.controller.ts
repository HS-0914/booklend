import { Controller, Delete, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';

import { Notification } from '../resources/db/domain/notification.entity';
import { RolesGuard } from '../resources/security/role.guard';
import { UserGuard } from '../resources/security/user.guard';
import { Roles } from '../resources/types/role.decorator';
import { RoleType } from '../resources/types/role.type';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  // 알림 내역 가져오기
  @Get()
  @ApiOperation({ summary: '알림 내역 확인' })
  @ApiResponse({ status: 200, type: Notification, isArray: true })
  @UseGuards(UserGuard)
  async getAllNotification(@Req() req: Request): Promise<Notification[]> {
    return await this.notificationService.getAllNotification(req.user.id);
  }

  // 알림 내용 가져오기
  @Get('/:id')
  @ApiOperation({ summary: '알림 확인' })
  @ApiResponse({ status: 200, type: Notification })
  @UseGuards(UserGuard)
  async getOneNotification(@Param('id') id: number): Promise<Notification> {
    return await this.notificationService.getOneNotification(id);
  }

  // 알림 삭제하기
  @Delete('/:id')
  @ApiOperation({ summary: '알림 삭제' })
  @ApiResponse({ status: 204 })
  @UseGuards(UserGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  async deleteNotification(@Param('id') id: number) {
    return await this.notificationService.deleteNotification(id);
  }
}
