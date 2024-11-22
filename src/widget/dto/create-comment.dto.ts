import { PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CommentModel } from '../entity/comment.entity';

export class CreateCommentDto extends PickType(CommentModel, [
  'body',
  'author',
  'authorProfileImage',
  'password',
]) {
  @IsOptional()
  parentId: string;
}
