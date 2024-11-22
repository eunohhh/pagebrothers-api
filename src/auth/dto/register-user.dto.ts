import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Providers } from 'src/common/const/provider.const';
import { UsersModel } from 'src/users/entity/users.entity';

export class RegisterUserDto extends PickType(UsersModel, [
  'name',
  'email',
  'provider',
  'providerId',
  'profileImage',
  'acceptMarketing',
]) {
  @ApiProperty({
    description: '이름',
    example: 'string',
  })
  name: string;

  @ApiProperty({
    description: '이메일',
    example: 'string',
  })
  email: string;

  @ApiProperty({
    description: '프로필 이미지',
    example: 'string',
  })
  profileImage: string;

  @ApiProperty({
    description: '프로바이더',
    example: 'KAKAO',
  })
  provider: Providers;

  @ApiProperty({
    description: '마케팅 수신 동의',
    example: 'true',
  })
  acceptMarketing: boolean;
}
