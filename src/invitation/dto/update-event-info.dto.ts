import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IInvitationLocation } from 'src/common/type/common.type';
import { locationExampleData } from '../data/invitation-example.data';
import { InvitationModel } from '../entity/invitation.entity';

export class UpdateEventInfoDto extends PickType(InvitationModel, [
  'eventAt',
  'fullDaySchedule',
  'location',
]) {
  @ApiProperty({
    description: '위치',
    example: locationExampleData,
  })
  location: IInvitationLocation;

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
}
