import { Transform } from 'class-transformer';
import { IsBoolean, IsString } from 'class-validator';

export class UpdateUserRoleDto {
  @IsString()
  email: string;

  // string으로 오면 강제로 boolean으로 변환 할것
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isAdmin: boolean;

  @IsString()
  password: string;
}
