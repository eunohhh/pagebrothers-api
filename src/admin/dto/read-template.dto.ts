import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { TemplateStage } from './create-template.dto';

export class ReadTemplatesQueryDto {
  @IsEnum(TemplateStage)
  @ApiProperty({ description: '템플릿 단계', example: 'BEST' })
  stage: TemplateStage;
}
