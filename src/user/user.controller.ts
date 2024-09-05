import { Body, Controller, Get, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Response, Request } from 'express';
import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';
import { UserGuard } from './security/user.guard';

@Controller('user')
export class UserController {
    constructor(private userService: UserService){}

    @Post('/register')
    @UsePipes(ValidationPipe)
    async registerAccount(@Body() userDTO: UserDTO): Promise<UserDTO> {
        return await this.userService.registerUser(userDTO);
    }
    
    @Post('/login')
    async login(@Body() userDTO: UserDTO, @Res() res: Response): Promise<any> {
        const jwt = await this.userService.validateUser(userDTO);
        res.setHeader('Authorization', 'Bearer ' + jwt.accessToken);
        res.cookie('jwt', jwt.accessToken, {
            httpOnly: true,
            maxAge: 60 * 1000, // 1000 ms
        })
        return res.send(jwt);
    }

    @Get('/auth-test')
    @UseGuards(UserGuard)
    isAuthenticated(@Req() req: Request): any { 
        const user: any = req.user;
        return user; 
    }


    @Get('/cookies')
    @UseGuards(UserGuard)
    getCookies(@Req() req: Request, @Res() res: Response): any {
        const jwt =  req.cookies['jwt'];
        return res.send(jwt);
    }

    @Post('/logout')
    logout(@Res() res: Response): any {
        res.cookie('jwt', '', {
            maxAge: 0
        })
        return res.send({
            message: 'success'
        })
    }
}
