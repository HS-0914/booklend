import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class BookDTO {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsOptional() // Checks if given value is empty (=== null, === undefined) and if so, ignores all the validators on the property. | === '' 는 아닌듯
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    newPassword: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    checkNewPassword: string;
}