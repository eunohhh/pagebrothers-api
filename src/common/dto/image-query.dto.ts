import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export class ImageQueryDto {
  @IsOptional()
  @IsInt({ message: 'width는 숫자여야 합니다.' })
  @Min(1, { message: 'width는 1 이상이어야 합니다.' })
  @ApiProperty({
    description: '이미지 너비',
    required: false,
  })
  width?: number;

  @IsOptional()
  @IsInt({ message: 'height는 숫자여야 합니다.' })
  @Min(1, { message: 'height는 1 이상이어야 합니다.' })
  @ApiProperty({
    description: '이미지 높이',
    required: false,
  })
  height?: number;
}
