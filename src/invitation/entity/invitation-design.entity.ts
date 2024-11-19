import { BaseModel } from 'src/common/entity/base.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { InvitationModel } from './invitation.entity';

@Entity()
export class InvitationDesignModel extends BaseModel {
  @Column()
  layoutType: 'WIDGETS';

  @Column()
  brandColor: string;

  @Column()
  font: string;

  @Column()
  textSize: string;

  @Column()
  zoomDisabled: boolean;

  @OneToOne(() => InvitationModel, (invitation) => invitation.meta)
  @JoinColumn({ name: 'invitation_id' })
  invitation: InvitationModel;
}
