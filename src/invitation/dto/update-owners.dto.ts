import { PickType } from '@nestjs/mapped-types';
import { InvitationModel } from '../entity/invitation.entity';

export class UpdateOwnersDto extends PickType(InvitationModel, ['owners']) {}
