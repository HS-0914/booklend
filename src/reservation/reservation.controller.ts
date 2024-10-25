import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { KafkaService, ReservationService } from './reservation.service';
import { UserGuard } from '../security/user.guard';
import { ReservationDTO } from './dto/reservation.dto';
import { Request } from 'express';
import { Reservation } from '../domain/reservation.entity';

@Controller('reservation')
export class ReservationController {
  constructor(
    private reservationService: ReservationService,
    private kafkaService: KafkaService,
  ) {}

  @Post()
  @UseGuards(UserGuard)
  async createReservation(
    @Req() req: Request,
    @Body() { bookId }: ReservationDTO,
  ): Promise<Reservation> {
    return await this.reservationService.createReservation(req.user.id, bookId);
  }

  @Get()
  @UseGuards(UserGuard)
  async getAllReservation(@Req() req: Request): Promise<Reservation[]> {
    return await this.reservationService.getAllReservation(req.user.id);
  }

  @Get('/:id')
  @UseGuards(UserGuard)
  async getOneReservation(
    @Req() req: Request,
    @Param('id') id: number,
  ): Promise<Reservation> {
    return await this.reservationService.getOneReservation(id, req.user.id);
  }

  @Delete('/:id')
  @UseGuards(UserGuard)
  async deleteReservation(@Param('id') id: number): Promise<Reservation> {
    return await this.reservationService.deleteReservation(id);
  }

  @Post('add-topic')
  async addSubscriptionTopic(@Body('topic') topic: string): Promise<string> {
    console.log(topic);
    if (topic == undefined) {
      return 'topic is undefined';
    } else {
      await this.kafkaService.addSubscriptionTopic(topic);
      return `topic ${topic} added`;
    }
  }
}
