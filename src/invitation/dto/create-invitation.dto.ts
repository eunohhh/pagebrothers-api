import { PickType } from '@nestjs/mapped-types';
import { InvitationModel } from '../entity/invitation.entity';

export class CreateInvitationDto extends PickType(InvitationModel, [
  'user',
  'eventAt',
  'fullDaySchedule',
  'location',
  'owners',
  'templateId',
]) {}
