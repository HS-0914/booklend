import { Body, Controller, Get, Post, Put, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';

import { User } from '../resources/db/domain/user.entity';
import { Payload } from '../resources/security/payload.interface';
import { RolesGuard } from '../resources/security/role.guard';
import { UserGuard } from '../resources/security/user.guard';
import { Roles } from '../resources/types/role.decorator';
import { RoleType } from '../resources/types/role.type';
import { CreateUserDTO, EditUserDTO, UserDTO, VerifyUserDTO } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('유저 API')
export class UserController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private env: ConfigService,
  ) {}

  // 회원 가입
  @ApiOperation({ summary: '회원 가입' })
  @ApiResponse({ status: 201, type: CreateUserDTO })
  @Post('/register')
  @UsePipes(ValidationPipe)
  async registerAccount(@Body() userDTO: CreateUserDTO): Promise<CreateUserDTO> {
    return plainToInstance(CreateUserDTO, await this.userService.registerUser(userDTO));
  }

  // 회원 인증
  @ApiOperation({ summary: '회원 인증' })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR...',
      },
    },
  })
  @Post('/verify')
  @UsePipes(ValidationPipe)
  async verifyUser(@Body() userDTO: VerifyUserDTO, @Res() res: Response) {
    const verifyAndJwt = await this.userService.vertifyUser(userDTO);
    if (verifyAndJwt) {
      const accessToken = this.jwtService.sign(verifyAndJwt);
      // res.setHeader('Authorization', 'Bearer ' + accessToken);
      res.cookie('jwt', accessToken, {
        signed: true,
        httpOnly: true, // xss 방지
        maxAge: this.env.get<number>('COOKIE_MAXAGE'),
        sameSite: 'none',
        secure: true,
      });
      return res.send({ accessToken, message: 'access' });
    }
  }

  // 로그인
  @ApiOperation({ summary: '로그인' })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR...',
      },
    },
  })
  @Post('/login')
  @UsePipes(ValidationPipe)
  async login(@Body() userDTO: UserDTO, @Res() res: Response): Promise<any> {
    const jwt: Payload = await this.userService.validateUser(userDTO);
    if (jwt) {
      const accessToken = this.jwtService.sign(jwt);
      // res.setHeader('Authorization', 'Bearer ' + accessToken);
      res.cookie('jwt', accessToken, {
        signed: true,
        httpOnly: true, // xss 방지
        maxAge: this.env.get<number>('COOKIE_MAXAGE'), // 1000 ms
        sameSite: 'none',
        secure: true,
      });
      return res.send({ accessToken, message: 'access' });
    } else {
      res.status(401).send({ message: '이메일 인증이 필요합니다.' });
    }
  }

  // 회원 정보 조회
  @Get('/profile')
  @ApiOperation({ summary: '회원 정보 조회' })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(UserGuard, RolesGuard)
  @Roles(RoleType.USER)
  getProfile(@Req() req: Request, @Res() res: Response): any {
    return res.send(req.user);
  }

  // 회원 정보 수정
  @Put('/profile')
  @ApiOperation({ summary: '회원 정보 수정' })
  @UseGuards(UserGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  @Roles(RoleType.USER)
  async putProfile(@Body() userDTO: EditUserDTO): Promise<any> {
    return await this.userService.updateUser(userDTO);
  }

  // 권한 관리
  @Put('/role')
  @ApiOperation({ summary: '권한 관리' })
  @UseGuards(UserGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  @Roles(RoleType.ROOT)
  async putRole(@Body() userDTO: UserDTO): Promise<any> {
    return await this.userService.updateRole(userDTO);
  }

  // 로그아웃
  @Post('/logout')
  @ApiOperation({ summary: '로그아웃' })
  @ApiResponse({
    status: 200,
    schema: { example: { message: 'success' } },
  })
  logout(@Res() res: Response): any {
    res.clearCookie('jwt', {
      signed: true,
      httpOnly: true, // xss 방지
      maxAge: this.env.get<number>('COOKIE_MAXAGE'), // 1000 ms
      sameSite: 'none',
      secure: true,
    });
    return res.status(204).send();
  }

  // 쿠키 테스트
  @Get('/cookie-test')
  @UseGuards(UserGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  getCookies(@Req() req: Request, @Res() res: Response): any {
    const jwt = req.signedCookies['jwt'];
    return res.send(jwt);
  }
}
