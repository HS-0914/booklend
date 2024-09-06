import { Body, Controller, Get, Post, Put, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Response, Request } from 'express';
import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';
import { UserGuard } from './security/user.guard';
import { Payload } from './security/payload.interface';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
    constructor(private userService: UserService,  private jwtService: JwtService){}

    @Post('/register')
    @UsePipes(ValidationPipe)
    async registerAccount(@Body() userDTO: UserDTO): Promise<UserDTO> {
        return await this.userService.registerUser(userDTO);
    }
    
    @Post('/login')
    @UsePipes(ValidationPipe)
    async login(@Body() userDTO: UserDTO, @Res() res: Response): Promise<any> {
        const jwt: Payload = await this.userService.validateUser(userDTO);
        const accessToken = this.jwtService.sign(jwt)
        res.setHeader('Authorization', 'Bearer ' + accessToken);
        res.cookie('AuthToken', accessToken, {
            httpOnly: true,
            maxAge: 60 * 1000, // 1000 ms
        })
        return res.json({ accessToken: accessToken });
    }

    @Get('/profile')
    @UseGuards(UserGuard)
    getProfile(@Req() req: Request, @Res() res: Response): any {
        return res.send(req.user);
    }

    @Put('/profile')
    @UseGuards(UserGuard)
    @UsePipes(ValidationPipe)
    putProfile(@Body() userDTO: UserDTO) {
        return this.userService.updateUser(userDTO);
    }
 
    @Post('/logout')
    logout(@Res() res: Response): any {
        res.cookie('AuthToken', '', {
            maxAge: 0
        })
        return res.send({
            message: 'success'
        })
    }

    @Get('/cookie-test')
    @UseGuards(UserGuard)
    getCookies(@Req() req: Request, @Res() res: Response): any {
        const jwt =  req.cookies['AuthToken'];
        return res.send(jwt);
    }
}
