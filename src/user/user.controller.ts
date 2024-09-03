import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService){}

    @Post('/register')
    @UsePipes(ValidationPipe)
    async registerAccount(@Body() userDTO: UserDTO): Promise<UserDTO> {
        return await this.userService.registerUser(userDTO);
    }
    
}
