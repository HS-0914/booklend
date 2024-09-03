import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService){}

    @Post('/register')
    @UsePipes(ValidationPipe)
    registerAccount(@Body() userDTO: UserDTO) {
        return this.userService.registerUser(userDTO);
    }
    
}
