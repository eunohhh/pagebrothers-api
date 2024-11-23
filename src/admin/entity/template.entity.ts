import { InvitationModel } from 'src/invitation/entity/invitation.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class TemplateModel extends InvitationModel {
  @Column({ nullable: true })
  stage: string;
}
