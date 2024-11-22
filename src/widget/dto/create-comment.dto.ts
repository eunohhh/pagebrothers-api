import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CommentModel } from '../entity/comment.entity';

export class CreateCommentDto extends PickType(CommentModel, [
  'body',
  'author',
  'authorProfileImage',
  'password',
]) {
  @ApiProperty({
    description: '댓글 내용',
    required: true,
  })
  body: string;

  @ApiProperty({
    description: '작성자 이름',
    required: true,
  })
  author: string;

  @ApiProperty({
    description: '작성자 프로필 이미지',
    required: true,
  })
  authorProfileImage: string;

  @ApiProperty({
    description: '댓글 비밀번호',
    required: true,
  })
  password: string;

  @IsOptional()
  parentId: string;
}
