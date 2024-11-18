import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import { Providers } from 'src/common/const/provider.const';
import { Repository } from 'typeorm';
import { UsersModel } from './entity/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
  ) {}

  async getAllUsers() {
    return this.usersRepository.find();
  }

  async getUserByEmail(email: string) {
    return this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }

  async createUser(user: RegisterUserDto) {
    const emailExists = await this.usersRepository.exists({
      where: {
        email: user.email,
      },
    });
    if (emailExists) {
      throw new BadRequestException('이미 존재하는 이메일입니다!');
    }

    const userObject = this.usersRepository.create({
      name: user.name,
      email: user.email,
      provider: user.provider.toUpperCase() as Providers,
      providerId: user.providerId,
      profileImage: user.profileImage,
      acceptMarketing: user.acceptMarketing ?? true,
    });

    return await this.usersRepository.save(userObject);
  }
}
