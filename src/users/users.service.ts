import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserRoleDto } from 'src/admin/dto/update-user.dto';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import { ENV_JWT_SECRET_KEY } from 'src/common/const/env-keys.const';
import { Providers } from 'src/common/const/provider.const';
import { Repository } from 'typeorm';
import { UsersModel } from './entity/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
    private readonly configService: ConfigService,
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

  async updateUserRole(dto: UpdateUserRoleDto) {
    const adminPassword = this.configService.get(ENV_JWT_SECRET_KEY);
    if (dto.password !== adminPassword) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다!');
    }

    const existingUser = await this.usersRepository.exists({
      where: {
        email: dto.email,
      },
    });

    if (!existingUser) {
      throw new BadRequestException('존재하지 않는 유저입니다!');
    }
    await this.usersRepository.update(
      { email: dto.email },
      { isAdmin: dto.isAdmin },
    );

    return true;
  }
}
