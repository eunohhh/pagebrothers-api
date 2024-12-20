import { BaseModel } from 'src/common/entity/base.entity';
import { ImageModel } from 'src/common/entity/image.entity';
import {
  IInvitationLocation,
  IInvitationShare,
} from 'src/common/type/common.type';
import { InvitationDesignModel } from 'src/invitation/entity/invitation-design.entity';
import { InvitationMetaModel } from 'src/invitation/entity/invitation-meta.entity';
import { InvitationOwnerModel } from 'src/invitation/entity/invitation-owner.entity';
import { OrderModel } from 'src/invitation/entity/order.entity';
import { VisitsCountModel } from 'src/invitation/entity/visits-count.entity';
import { UsersModel } from 'src/users/entity/users.entity';
import { CommentModel } from 'src/widget/entity/comment.entity';
import { RowModel } from 'src/widget/entity/rsvp-row.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { WidgetItemModel } from '../../widget/entity/widget-item.entity';

@Entity()
export class TemplateModel extends BaseModel {
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

  @OneToMany(() => InvitationOwnerModel, (owner) => owner.invitation, {
    cascade: true,
  })
  owners: InvitationOwnerModel[];

  // widgets
  @OneToMany(() => WidgetItemModel, (widget) => widget.invitation, {
    cascade: true,
    // eager: true,
  })
  widgets: WidgetItemModel[];

  // images
  @OneToMany(() => ImageModel, (image) => image.invitations)
  images: ImageModel[];

  @Column({ nullable: true })
  fullDaySchedule: boolean;

  @Column({ nullable: true })
  editingExpired: boolean;

  @Column({ type: 'jsonb', nullable: true })
  share: IInvitationShare | null;

  @Column({ nullable: true })
  customDomain: string | null;

  @OneToOne(() => InvitationMetaModel, (meta) => meta.invitation, {
    cascade: true,
  })
  @JoinColumn()
  meta: InvitationMetaModel;

  @OneToOne(() => InvitationDesignModel, (design) => design.invitation, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  design: InvitationDesignModel;

  @OneToOne(() => VisitsCountModel, (visitsCount) => visitsCount.invitation, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  visitsCount: VisitsCountModel;

  @OneToOne(() => OrderModel, (order) => order.invitation, {
    cascade: true,
    onDelete: 'CASCADE',
    // eager: true,
  })
  order: OrderModel;

  @OneToMany(() => RowModel, (row) => row.invitation, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  rows: RowModel[];

  @OneToMany(() => CommentModel, (comment) => comment.invitation, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  comments: CommentModel[];

  @Column({ nullable: true })
  stage: string;

  @Column({ nullable: true })
  number: number;
}
