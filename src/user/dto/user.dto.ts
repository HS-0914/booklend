import { IsEmail, IsNotEmpty } from "class-validator";

export class UserDTO {
    @IsNotEmpty()
    username: string;
    @IsNotEmpty()
    password: string;
    @IsNotEmpty()
    @IsEmail()
    email: string;
}