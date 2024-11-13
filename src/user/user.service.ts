import { HttpException, HttpStatus, Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/domain/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { UserDTO } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { Payload } from '../security/payload.interface';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    this.createAdmin();
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
      });
      await this.userRepository.save(root);
      console.log('createRoot');
    }
  }

  // 회원가입
  async registerUser(newuserDTO: UserDTO): Promise<UserDTO> {
    // username or email 중복 걸러내기
    let userFind: User = await this.findByFields({
      where: [{ username: newuserDTO.username }, { email: newuserDTO.email }],
    });
    if (userFind) {
      throw new HttpException('Username or Email aleady used (๑•᎑<๑)ｰ☆', HttpStatus.BAD_REQUEST);
    }
    newuserDTO.password = await this.transformPw(newuserDTO.password);
    return await this.userRepository.save(newuserDTO);
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
  async validateUser(userDTO: UserDTO): Promise<Payload> {
    const userFind = await this.findByFields({
      where: { username: userDTO.username },
    });
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

  // 회원 정보 수정
  async updateUser(userDTO: UserDTO) {
    if (userDTO.newPassword !== userDTO.checkNewPassword || userDTO.newPassword === userDTO.password) {
      throw new HttpException('newPw and checkPw do not match! (๑•᎑<๑)ｰ☆', HttpStatus.BAD_REQUEST);
    }
    const validate = await this.validateUser(userDTO);
    const updateResult = this.userRepository.update(
      { id: validate.id },
      {
        email: userDTO.email,
        password: await this.transformPw(userDTO.newPassword),
      },
    );
    return updateResult;
  }

  // 회원 권한 수정
  async updateRole(userDTO: UserDTO) {
    const updateResult = this.userRepository.update(
      { username: userDTO.username },
      {
        role: userDTO.role,
      },
    );
    return updateResult;
  }
}
