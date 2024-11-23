import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ReadTemplatesQueryDto {
  @IsString()
  @ApiProperty({ description: '템플릿 단계', example: 'BEST' })
  stage: string;
}
