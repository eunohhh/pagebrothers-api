import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IInvitationLocation } from 'src/common/type/common.type';
import {
  locationExampleData,
  ownerExampleData,
} from '../data/invitation-example.data';
import { InvitationOwnerModel } from '../entity/invitation-owner.entity';
import { InvitationModel } from '../entity/invitation.entity';

export class CreateInvitationDto extends PickType(InvitationModel, [
  'user',
  'eventAt',
  'fullDaySchedule',
  'location',
  'owners',
  'templateId',
]) {
  @ApiProperty({
    description: '이벤트 일시',
    example: 'string',
  })
  eventAt: Date;

  @ApiProperty({
    description: '하루 종일 일정 여부',
    example: 'true',
  })
  fullDaySchedule: boolean;

  @ApiProperty({
    description: '위치',
    example: locationExampleData,
  })
  location: IInvitationLocation;

  @ApiProperty({
    description: '청첩장 소유자',
    example: [ownerExampleData],
  })
  owners: InvitationOwnerModel[];

  @ApiProperty({
    description: '템플릿 ID',
    example: 'string',
  })
  templateId: string;
}
