import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { UserGuard } from '../resources/security/user.guard';
import { ReservationDTO } from './dto/reservation.dto';
import { Request } from 'express';
import { Reservation } from '../resources/db/domain/reservation.entity';
import { RolesGuard } from '../resources/security/role.guard';
import { Roles } from '../resources/types/role.decorator';
import { RoleType } from '../resources/types/role.type';

@Controller('reservation')
export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  @Post()
  @UseGuards(UserGuard)
  async createReservation(@Req() req: Request, @Body() { bookId }: ReservationDTO): Promise<Reservation> {
    return await this.reservationService.createReservation(req.user.id, bookId);
  }

  @Get()
  @UseGuards(UserGuard)
  async getAllReservation(@Req() req: Request): Promise<Reservation[]> {
    return await this.reservationService.getAllReservation(req.user.id);
  }

  @Get('/:id')
  @UseGuards(UserGuard)
  async getOneReservation(@Req() req: Request, @Param('id') id: number): Promise<Reservation> {
    return await this.reservationService.getOneReservation(id, req.user.id);
  }

  @Delete('cancel/:id')
  @UseGuards(UserGuard)
  async cancelReservation(@Param('id') id: number): Promise<any> {
    return await this.reservationService.cancelReservation(id);
  }

  @Delete('/:id')
  @UseGuards(UserGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  async deleteReservation(@Param('id') id: number): Promise<Reservation> {
    return await this.reservationService.deleteReservation(id);
  }
}
