import { PickType } from '@nestjs/swagger';
import { RsvpExtraFieldModel } from '../entity/rsvp-extra-fields.entity';

export class CreateRsvpExtraFieldDto extends PickType(RsvpExtraFieldModel, [
  'label',
  'needResponseRejected',
  'options',
  'placeholder',
  'type',
]) {}
