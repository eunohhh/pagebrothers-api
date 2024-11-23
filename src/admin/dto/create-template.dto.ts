import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum TemplateStage {
  BEST = 'BEST',
  NORMAL = 'NORMAL',
}

export class CreateTemplateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '청첩장 ID',
    example: 'string',
  })
  invitationId: string;

  @IsEnum(TemplateStage)
  @IsNotEmpty()
  @ApiProperty({
    description: '템플릿 단계',
    example: 'BEST',
  })
  stage: TemplateStage;
}
