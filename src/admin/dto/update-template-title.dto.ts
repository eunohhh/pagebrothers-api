import { IsString } from 'class-validator';

export class UpdateTemplateTitleDto {
  @IsString()
  title: string;
}
