import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/domain/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { UserDTO } from './dto/user.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}

    async registerUser(userDTO: UserDTO): Promise<UserDTO> {
        let userFind: UserDTO = await this.findByFields({
            where: [
                { username: userDTO.username },
                { email: userDTO.email }
            ]
        });
        if(userFind) {
            throw new HttpException('Username or email aleady used!', HttpStatus.BAD_REQUEST);
        }
        await this.transformPass(userDTO);
        console.log(userDTO);
        return await this.userRepository.save(userDTO);
    }

    async findByFields(options: FindOneOptions<UserDTO>): Promise<User | undefined> {
        return await this.userRepository.findOne(options);
    }

    async transformPass(userDTO: UserDTO): Promise<void> {
        userDTO.password = await bcrypt.hash(
            userDTO.password, 10,
        );
    }
}
