import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { ownerExampleData } from '../data/invitation-example.data';
import { InvitationOwnerModel } from '../entity/invitation-owner.entity';
import { InvitationModel } from '../entity/invitation.entity';

export class UpdateOwnersDto extends PickType(InvitationModel, ['owners']) {
  @ApiProperty({
    description: '청첩장 소유자',
    example: [ownerExampleData],
  })
  owners: InvitationOwnerModel[];
}
