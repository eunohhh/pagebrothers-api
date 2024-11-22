import { ApiProperty } from '@nestjs/swagger';
import { designExampleData } from '../data/invitation-example.data';
import { InvitationDesignModel } from '../entity/invitation-design.entity';

export class UpdateDesignDto {
  @ApiProperty({
    description: '청첩장 디자인 정보',
    example: designExampleData,
  })
  design: InvitationDesignModel;
}
