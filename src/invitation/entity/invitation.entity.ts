import { BaseModel } from 'src/common/entity/base.entity';
import { ImageModel } from 'src/common/entity/image.entity';
import {
  IInvitationDesign,
  IInvitationLocation,
  IInvitationShare,
} from 'src/common/type/common.type';
import { UsersModel } from 'src/users/entity/users.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { InvitationMetaModel } from './invitation-meta.entity';
import { InvitationOwnerModel } from './invitation-owner.entity';
import { WidgetItemModel } from './widget-item.entity';

@Entity()
export class InvitationModel extends BaseModel {
  @ManyToOne(() => UsersModel, (user) => user.invitations)
  user: UsersModel;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  templateId: string;

  @Column()
  eventAt: Date;

  @Column({ type: 'jsonb' })
  location: IInvitationLocation;

  @Column({ type: 'jsonb', nullable: true })
  design: IInvitationDesign;

  @OneToMany(() => InvitationOwnerModel, (owner) => owner.invitation)
  owners: InvitationOwnerModel[];

  // widgets
  @OneToMany(() => WidgetItemModel, (widget) => widget.invitation)
  widgets: WidgetItemModel[];

  // images
  @ManyToMany(() => ImageModel, (image) => image.invitations)
  images: ImageModel[];

  @Column({ nullable: true })
  fullDaySchedule: boolean;

  @Column({ nullable: true })
  editingExpired: boolean;

  @Column({ type: 'jsonb', nullable: true })
  share: IInvitationShare | null;

  @Column({ nullable: true })
  customDomain: string | null;

  @OneToOne(() => InvitationMetaModel, (meta) => meta.invitation)
  meta: InvitationMetaModel;
}
