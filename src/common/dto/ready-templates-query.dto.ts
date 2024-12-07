import { IsEnum } from 'class-validator';
import { TemplateStage } from 'src/admin/dto/create-template.dto';

export class ReadyTemplatesQueryDto {
  @IsEnum(TemplateStage)
  stage: TemplateStage;
}
