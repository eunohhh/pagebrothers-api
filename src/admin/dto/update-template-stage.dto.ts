import { IsEnum } from 'class-validator';
import { TemplateStage } from './create-template.dto';

export class UpdateTemplateStageDto {
  @IsEnum(TemplateStage)
  stage: TemplateStage;
}
