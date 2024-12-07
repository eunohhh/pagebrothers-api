import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TemplateStage } from './create-template.dto';

class TemplateOrderPair {
  @IsString()
  id: string;

  @IsNumber()
  order: number;
}

export class UpdateTemplateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TemplateOrderPair)
  @ApiProperty({
    description: '템플릿 순서 쌍',
    example: [{ id: '123e4567-e89b-12d3-a456-426614174000', order: 0 }],
  })
  pairs: TemplateOrderPair[];

  @IsEnum(TemplateStage)
  @ApiProperty({
    description: '템플릿 스테이지',
    example: 'BEST',
  })
  stage: TemplateStage;
}
