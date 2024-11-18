import { BaseModel } from 'src/common/entity/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { InvitationModel } from './invitation.entity';

@Entity()
export class InvitationOwnerModel extends BaseModel {
  @Column()
  role: string;

  @Column()
  name: string; // from owners[].personName

  @ManyToOne(() => InvitationModel, (invitation) => invitation.owners, {
    cascade: true,
  })
  invitation: InvitationModel;
}
