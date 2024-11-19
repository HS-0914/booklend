import { HttpException, HttpStatus, Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../resources/db/domain/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateUserDTO, EditUserDTO, UserDTO, VerifyUserDTO } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { Payload } from '../resources/security/payload.interface';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mail: MailerService,
  ) {}

  async onModuleInit() {
    await this.createAdmin();
  }

  private async createAdmin() {
    const username = process.env.ROOT_NAME;
    const user = await this.userRepository.findOne({
      where: { username: username },
    });
    if (!user) {
      const password = await this.transformPw(process.env.ROOT_PASS);
      const root = this.userRepository.create({
        id: 1,
        username,
        email: process.env.ROOT_EMAIL,
        password,
        role: process.env.ROOT_ROLE,
        verification: 'verified',
      });
      await this.userRepository.save(root);
      console.log('createRoot');
    }
  }

  // 회원가입
  async registerUser(newuserDTO: CreateUserDTO): Promise<CreateUserDTO> {
    // username or email 중복 걸러내기
    let userFind: User = await this.findByFields({
      where: [{ username: newuserDTO.username }, { email: newuserDTO.email }],
    });
    if (userFind) {
      throw new HttpException('Username or Email aleady used (๑•᎑<๑)ｰ☆', HttpStatus.BAD_REQUEST);
    }
    newuserDTO.password = await this.transformPw(newuserDTO.password);
    newuserDTO.verification = Math.floor(100000 + Math.random() * 900000).toString();
    await this.sendMail(newuserDTO);
    return await this.userRepository.save(newuserDTO);
  }

  private async sendMail(newuserDTO: CreateUserDTO) {
    await this.mail.sendMail({
      to: newuserDTO.email,
      subject: '이메일 인증',
      template: './verification-email',
      context: {
        verificationCode: newuserDTO.verification,
        // notification: JSON.stringify({ notification }),
      },
    });
  }
  // db에서 찾기
  private async findByFields(options: FindOneOptions<User>): Promise<User | undefined> {
    return await this.userRepository.findOne(options);
  }

  // password 암호화
  private async transformPw(transPw: string): Promise<string> {
    transPw = await bcrypt.hash(transPw, 10);
    return transPw;
  }

  // 유저 인증 + payload 만들어주기
  async validateUser(userDTO: UserDTO | VerifyUserDTO | EditUserDTO): Promise<Payload | undefined> {
    const userFind = await this.findByFields({
      where: { username: userDTO.username },
    });
    if (userFind.verification !== 'verified') {
      return undefined;
    }
    const validatePw = await bcrypt.compare(userDTO.password, userFind.password); // 값은 true or false
    if (!userFind || !validatePw) {
      // 아이디 or 비번 틀림
      throw new UnauthorizedException();
    }

    const payload: Payload = { id: userFind.id, username: userFind.username, role: userFind.role };
    return payload;
  }

  // payload id로 유저 확인
  async tokenValidateUser(payload: Payload): Promise<User | undefined> {
    return await this.findByFields({
      where: { id: payload.id },
    });
  }

  // 인증코드 확인
  async vertifyUser(userDTO: VerifyUserDTO): Promise<Payload | undefined> {
    const userFind: User = await this.findByFields({
      where: { username: userDTO.username },
    });
    const validatePw = await bcrypt.compare(userDTO.password, userFind.password); // 값은 true or false
    if (!userFind || !validatePw) {
      // 아이디 or 비번 틀림
      throw new UnauthorizedException();
    }

    if (userDTO.verification === userFind.verification) {
      await this.userRepository.update({ username: userFind.username }, { verification: 'verified' });
      return await this.validateUser(userDTO);
    } else if (userFind.verification === 'verified') {
      throw new HttpException('already verified (๑•᎑<๑)ｰ☆', HttpStatus.BAD_REQUEST);
    } else {
      throw new HttpException('code not match (๑•᎑<๑)ｰ☆', HttpStatus.BAD_REQUEST);
    }
  }

  // 회원 정보 수정
  async updateUser(userDTO: EditUserDTO) {
    if (userDTO.password === userDTO.newPassword || userDTO.newPassword !== userDTO.checkNewPassword) {
      throw new HttpException(
        'currentPW and newPW same or newPw and checkPw do not match! (๑•᎑<๑)ｰ☆',
        HttpStatus.BAD_REQUEST,
      );
    }
    const validate = await this.validateUser(userDTO);
    return this.userRepository.update(
      { id: validate.id },
      {
        password: await this.transformPw(userDTO.newPassword),
      },
    );
  }

  // 회원 권한 수정
  async updateRole(userDTO: UserDTO) {
    return await this.userRepository.update(
      { username: userDTO.username },
      {
        role: userDTO.role,
      },
    );
  }
}
