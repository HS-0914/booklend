import { Body, Controller, Get, Post, Put, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Response, Request } from 'express';
import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';
import { UserGuard } from '../resources/security/user.guard';
import { Payload } from '../resources/security/payload.interface';
import { JwtService } from '@nestjs/jwt';
import { RolesGuard } from '../resources/security/role.guard';
import { Roles } from './role.decorator';
import { RoleType } from 'src/resources/types/role.type';

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
  @UseGuards(UserGuard, RolesGuard)
  @Roles(RoleType.USER)
  getProfile(@Req() req: Request, @Res() res: Response): any {
    return res.send(req.user);
  }

  // 회원 정보 수정
  @Put('/profile')
  @UseGuards(UserGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  @Roles(RoleType.USER)
  async putProfile(@Body() userDTO: UserDTO): Promise<any> {
    return await this.userService.updateUser(userDTO);
  }

  // 권한 관리
  @Put('/role')
  @UseGuards(UserGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  @Roles(RoleType.ROOT)
  async putRole(@Body() userDTO: UserDTO): Promise<any> {
    return await this.userService.updateRole(userDTO);
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
  @UseGuards(UserGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  getCookies(@Req() req: Request, @Res() res: Response): any {
    const jwt = req.cookies['AuthToken'];
    return res.send(jwt);
  }
}
