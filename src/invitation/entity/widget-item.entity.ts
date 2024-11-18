import { BaseModel } from 'src/common/entity/base.entity';
import { WidgetType } from 'src/common/type/common.type';
import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { InvitationModel } from './invitation.entity';
import { WidgetConfigModel } from './widget-config.entity';

@Entity()
export class WidgetItemModel extends BaseModel {
  @Column()
  type: WidgetType;

  @OneToOne(() => WidgetConfigModel, (config) => config.relationItem)
  config: WidgetConfigModel;

  @ManyToOne(() => InvitationModel, (invitation) => invitation.widgets)
  invitation: InvitationModel;
}
