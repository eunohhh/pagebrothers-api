import { BaseModel } from 'src/common/entity/base.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { InvitationModel } from './invitation.entity';

@Entity()
export class VisitsCountModel extends BaseModel {
  @OneToOne(() => InvitationModel, (invitation) => invitation.visitsCount)
  @JoinColumn({ name: 'invitation_id' })
  invitation: InvitationModel;

  @Column({ default: 0 })
  count: number;
}
