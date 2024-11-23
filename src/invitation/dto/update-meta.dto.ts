import { ApiProperty } from '@nestjs/swagger';
import { metaExampleData } from '../data/invitation-example.data';
import { InvitationMetaModel } from '../entity/invitation-meta.entity';

export class UpdateMetaDto {
  @ApiProperty({
    description: '청첩장 메타 정보',
    example: metaExampleData,
  })
  meta: InvitationMetaModel;
}
