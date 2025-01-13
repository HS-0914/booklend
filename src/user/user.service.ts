import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { FindOneOptions, Repository } from 'typeorm';

import { User } from '../resources/db/domain/user.entity';
import { Payload } from '../resources/security/payload.interface';
import { CreateUserDTO, EditUserDTO, UserDTO, VerifyUserDTO } from './dto/user.dto';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mail: MailerService,
    private env: ConfigService,
  ) {}

  async onModuleInit() {
    await this.createAdmin();
  }

  private async createAdmin() {
    const email = this.env.get<string>('ROOT_EMAIL');
    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    if (!user) {
      const password = await this.transformPw(this.env.get<string>('ROOT_PASS'));
      const root = this.userRepository.create({
        id: 1,
        email,
        password,
        role: this.env.get<string>('ROOT_ROLE'),
        verification: 'verified',
      });
      await this.userRepository.save(root);
      console.log('createRoot');
    }
  }

  // 회원가입
  async registerUser(newuserDTO: CreateUserDTO): Promise<CreateUserDTO> {
    // email 중복 걸러내기
    let userFind: User = await this.findByFields({
      where: { email: newuserDTO.email },
    });
    if (userFind) {
      throw new HttpException('이미 사용중인 이메일입니다. (๑•᎑<๑)ｰ☆', HttpStatus.BAD_REQUEST);
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
      where: { email: userDTO.email },
    });
    if (userFind.verification !== 'verified') {
      return undefined;
    }
    const validatePw = await bcrypt.compare(userDTO.password, userFind.password); // 값은 true or false
    if (!userFind || !validatePw) {
      // 아이디 or 비번 틀림
      throw new HttpException(
        '아이디 또는 비밀번호가 잘못 되었습니다. 아이디와 비밀번호를 정확히 입력해 주세요. (๑•᎑<๑)ｰ☆',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload: Payload = { id: userFind.id, email: userFind.email, role: userFind.role };
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
      where: { email: userDTO.email },
    });
    const validatePw = await bcrypt.compare(userDTO.password, userFind.password); // 값은 true or false
    if (!userFind || !validatePw) {
      // 아이디 or 비번 틀림
      throw new UnauthorizedException();
    }

    if (userDTO.verification === userFind.verification) {
      await this.userRepository.update({ email: userFind.email }, { verification: 'verified' });
      return await this.validateUser(userDTO);
    } else if (userFind.verification === 'verified') {
      throw new HttpException('이미 인증됐습니다. (๑•᎑<๑)ｰ☆', HttpStatus.BAD_REQUEST);
    } else {
      throw new HttpException('올바른 인증코드를 입력해주세요. (๑•᎑<๑)ｰ☆', HttpStatus.BAD_REQUEST);
    }
  }

  // 회원 정보 수정
  async updateUser(userDTO: EditUserDTO) {
    if (userDTO.password === userDTO.newPassword || userDTO.newPassword !== userDTO.checkNewPassword) {
      throw new HttpException(
        '현재 비밀번호와 다르게 설정해야합니다. 비밀번호와 비밀번호 확인이 일치해야 합니다.(๑•᎑<๑)ｰ☆',
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
      { email: userDTO.email },
      {
        role: userDTO.role,
      },
    );
  }
}
