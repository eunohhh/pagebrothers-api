import { BaseModel } from 'src/common/entity/base.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { InvitationModel } from './invitation.entity';

@Entity()
export class InvitationMetaModel extends BaseModel {
  @Column()
  thumbnailUrl: string;

  @Column()
  thumbnailId: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  kakaotalkThumbnailId: string;

  @Column()
  kakaotalkTitle: string;

  @Column()
  kakaotalkDescription: string;

  @Column()
  kakaotalkUseLocationButton: boolean;

  @OneToOne(() => InvitationModel, (invitation) => invitation.meta)
  @JoinColumn({ name: 'invitation_id' })
  invitation: InvitationModel;
}
