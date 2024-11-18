import { PickType } from '@nestjs/mapped-types';
import { UsersModel } from 'src/users/entity/users.entity';

export class RegisterUserDto extends PickType(UsersModel, [
  'name',
  'email',
  'provider',
  'providerId',
  'profileImage',
  'acceptMarketing',
]) {}
