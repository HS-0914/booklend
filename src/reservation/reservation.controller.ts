import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { UserGuard } from '../resources/security/user.guard';
import { ReservationDTO } from './dto/reservation.dto';
import { Request } from 'express';
import { Reservation } from '../resources/db/domain/reservation.entity';
import { RolesGuard } from '../resources/security/role.guard';
import { Roles } from '../resources/types/role.decorator';
import { RoleType } from '../resources/types/role.type';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('reservation')
export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  @Post()
  @ApiOperation({ summary: '예약 추가' })
  @ApiResponse({ status: 201, type: Reservation })
  @UseGuards(UserGuard)
  async createReservation(@Req() req: Request, @Body() { bookId }: ReservationDTO): Promise<Reservation> {
    return await this.reservationService.createReservation(req.user.id, bookId);
  }

  @Get()
  @ApiOperation({ summary: '예약 내역 확인' })
  @ApiResponse({ status: 200, type: Reservation, isArray: true })
  @UseGuards(UserGuard)
  async getAllReservation(@Req() req: Request): Promise<Reservation[]> {
    return await this.reservationService.getAllReservation(req.user.id);
  }

  @Get('/:id')
  @ApiOperation({ summary: '예약 확인' })
  @ApiResponse({ status: 200, type: Reservation })
  @UseGuards(UserGuard)
  async getOneReservation(@Req() req: Request, @Param('id') id: number): Promise<Reservation> {
    return await this.reservationService.getOneReservation(id, req.user.id);
  }

  @Delete('cancel/:id')
  @ApiOperation({ summary: '예약 취소' })
  @UseGuards(UserGuard)
  async cancelReservation(@Param('id') id: number): Promise<any> {
    return await this.reservationService.cancelReservation(id);
  }

  @Delete('/:id')
  @ApiOperation({ summary: '예약 삭제' })
  @ApiResponse({ status: 200, type: Reservation })
  @UseGuards(UserGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  async deleteReservation(@Param('id') id: number): Promise<Reservation> {
    return await this.reservationService.deleteReservation(id);
  }
}
