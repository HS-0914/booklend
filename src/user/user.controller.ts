import { Body, Controller, Get, Post, Put, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Response, Request } from 'express';
import { UserService } from './user.service';
import { CreateUserDTO, EditUserDTO, UserDTO, VerifyUserDTO } from './dto/user.dto';
import { UserGuard } from '../resources/security/user.guard';
import { Payload } from '../resources/security/payload.interface';
import { JwtService } from '@nestjs/jwt';
import { RolesGuard } from '../resources/security/role.guard';
import { Roles } from '../resources/types/role.decorator';
import { RoleType } from 'src/resources/types/role.type';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/resources/db/domain/user.entity';
import { UpdateResult } from 'typeorm';

@Controller('user')
@ApiTags('유저 API')
export class UserController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  // 회원 가입
  @ApiOperation({ summary: '회원 가입' })
  @ApiResponse({ status: 201, type: CreateUserDTO })
  @ApiBody({ type: CreateUserDTO })
  @Post('/register')
  @UsePipes(ValidationPipe)
  async registerAccount(@Body() userDTO: CreateUserDTO): Promise<CreateUserDTO> {
    return await this.userService.registerUser(userDTO);
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
  @ApiBody({ type: VerifyUserDTO })
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
        maxAge: 3 * 60 * 1000, // 1000 ms
        sameSite: 'strict', // CSRF 방지
      });
      return res.status(200).send({ accessToken });
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
  @ApiBody({ type: UserDTO })
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
        maxAge: 3 * 60 * 1000, // 1000 ms
        sameSite: 'strict', // CSRF 방지
      });
      return res.send({ accessToken: accessToken });
    } else {
      res.status(406).send({ msg: 'need to verify' });
    }
  }

  // 회원 정보 조회
  @Get('/profile')
  @ApiOperation({ summary: '회원 정보 조회' })
  @ApiResponse({ type: User })
  @UseGuards(UserGuard, RolesGuard)
  @Roles(RoleType.USER)
  getProfile(@Req() req: Request, @Res() res: Response): any {
    return res.send(req.user);
  }

  // 회원 정보 수정
  @Put('/profile')
  @ApiOperation({ summary: '회원 정보 수정' })
  @ApiResponse({ type: UpdateResult })
  @UseGuards(UserGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  @Roles(RoleType.USER)
  async putProfile(@Body() userDTO: EditUserDTO): Promise<any> {
    return await this.userService.updateUser(userDTO);
  }

  // 권한 관리
  @Put('/role')
  @ApiOperation({ summary: '권한 관리' })
  @ApiResponse({ type: UpdateResult })
  @UseGuards(UserGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  @Roles(RoleType.ROOT)
  async putRole(@Body() userDTO: UserDTO): Promise<any> {
    return await this.userService.updateRole(userDTO);
  }

  // 로그아웃
  @Post('/logout')
  @ApiOperation({ summary: '권한 관리' })
  @ApiResponse({
    status: 200,
    schema: { example: { message: 'success' } },
  })
  logout(@Res() res: Response): any {
    res.clearCookie('jwt');
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
