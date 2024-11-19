import { BaseModel } from 'src/common/entity/base.entity';
import { WidgetType } from 'src/common/type/common.type';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { InvitationModel } from '../../invitation/entity/invitation.entity';
import { WidgetConfigModel } from './widget-config.entity';

@Entity()
export class WidgetItemModel extends BaseModel {
  @Column()
  type: WidgetType;

  @Column({ nullable: true })
  index: number;

  @OneToOne(() => WidgetConfigModel, (config) => config.relationItem)
  @JoinColumn()
  config: WidgetConfigModel;

  @ManyToOne(() => InvitationModel, (invitation) => invitation.widgets)
  invitation: InvitationModel;
}
