import { PickType } from '@nestjs/mapped-types';
import { InvitationModel } from '../entity/invitation.entity';

export class UpdateEventInfoDto extends PickType(InvitationModel, [
  'eventAt',
  'fullDaySchedule',
  'location',
]) {}
