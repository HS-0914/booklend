import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserDTO {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsOptional()
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

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  role: string;
}
