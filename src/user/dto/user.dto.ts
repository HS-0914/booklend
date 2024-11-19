import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsEmail, IsEmpty, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from 'class-validator';
import { RoleType } from 'src/resources/types/role.type';

export class CreateUserDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ description: 'min length = 5' })
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 5,
    minLowercase: 0,
    minUppercase: 0,
    minNumbers: 0,
    minSymbols: 0,
  })
  password: string;

  @ApiProperty({ example: 'example@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Exclude()
  @IsEmpty()
  verification: string;
}

export class VerifyUserDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ description: 'min length = 5' })
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 5,
    minLowercase: 0,
    minUppercase: 0,
    minNumbers: 0,
    minSymbols: 0,
  })
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  verification: string;
}

export class UserDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ description: 'min length = 5' })
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 5,
    minLowercase: 0,
    minUppercase: 0,
    minNumbers: 0,
    minSymbols: 0,
  })
  password: string;

  @ApiProperty({ description: 'optional', required: false, enum: RoleType })
  @IsOptional() // Checks if given value is empty (=== null, === undefined) and if so, ignores all the validators on the property. | === '' 는 아닌듯
  @IsNotEmpty()
  role: RoleType;
}

export class EditUserDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ description: 'min length = 5' })
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 5,
    minLowercase: 0,
    minUppercase: 0,
    minNumbers: 0,
    minSymbols: 0,
  })
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  newPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  checkNewPassword: string;
}
