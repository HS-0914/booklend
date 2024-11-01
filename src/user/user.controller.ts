import { Body, Controller, Get, Post, Put, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Response, Request } from 'express';
import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';
import { UserGuard } from '../security/user.guard';
import { Payload } from '../security/payload.interface';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  // 회원 가입
  @Post('/register')
  @UsePipes(ValidationPipe)
  async registerAccount(@Body() userDTO: UserDTO): Promise<UserDTO> {
    return await this.userService.registerUser(userDTO);
  }

  // 로그인
  @Post('/login')
  @UsePipes(ValidationPipe)
  async login(@Body() userDTO: UserDTO, @Res() res: Response): Promise<any> {
    const jwt: Payload = await this.userService.validateUser(userDTO);
    const accessToken = this.jwtService.sign(jwt);
    res.setHeader('Authorization', 'Bearer ' + accessToken);
    res.cookie('AuthToken', accessToken, {
      httpOnly: true, // xss 방지
      maxAge: 3 * 60 * 1000, // 1000 ms
      sameSite: 'strict', // CSRF 방지
    });
    return res.json({ accessToken: accessToken });
  }

  // 회원 정보 조회
  @Get('/profile')
  @UseGuards(UserGuard)
  getProfile(@Req() req: Request, @Res() res: Response): any {
    return res.send(req.user);
  }

  // 회원 정보 수정
  @Put('/profile')
  @UseGuards(UserGuard)
  @UsePipes(ValidationPipe)
  async putProfile(@Body() userDTO: UserDTO): Promise<any> {
    return await this.userService.updateUser(userDTO);
  }

  // 로그아웃
  @Post('/logout')
  logout(@Res() res: Response): any {
    res.cookie('AuthToken', '', {
      maxAge: 0,
    });
    return res.send({
      message: 'success',
    });
  }

  // 쿠키 테스트
  @Get('/cookie-test')
  @UseGuards(UserGuard)
  getCookies(@Req() req: Request, @Res() res: Response): any {
    const jwt = req.cookies['AuthToken'];
    return res.send(jwt);
  }
}
