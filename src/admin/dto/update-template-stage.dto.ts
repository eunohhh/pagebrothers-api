import { IsEnum } from 'class-validator';

enum TemplateStage {
  BEST = 'BEST',
  NORMAL = 'NORMAL',
}

export class UpdateTemplateStageDto {
  @IsEnum(TemplateStage)
  stage: TemplateStage;
}
