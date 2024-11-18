import { BaseModel } from 'src/common/entity/base.entity';
import { ImageModel } from 'src/common/entity/image.entity';
import {
  IInvitationDesign,
  IInvitationLocation,
  IInvitationShare,
} from 'src/common/type/common.type';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { InvitationOwnerModel } from './invitation-owner.entity';
import { WidgetItemModel } from './widget-item.entity';

@Entity()
export class InvitationModel extends BaseModel {
  @Column()
  eventAt: Date;

  @Column({ type: 'jsonb' })
  location: IInvitationLocation;

  @Column({ type: 'jsonb' })
  design: IInvitationDesign;

  @OneToMany(() => InvitationOwnerModel, (owner) => owner.invitation)
  owners: InvitationOwnerModel[];

  // widgets
  @OneToMany(() => WidgetItemModel, (widget) => widget.invitation)
  widgets: WidgetItemModel[];

  // images
  @ManyToMany(() => ImageModel, (image) => image.invitations)
  images: ImageModel[];

  @Column()
  fullDaySchedule: boolean;

  @Column()
  editingExpired: boolean;

  @Column({ type: 'jsonb', nullable: true })
  share: IInvitationShare | null;
}
