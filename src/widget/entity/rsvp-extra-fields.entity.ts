import { BaseModel } from 'src/common/entity/base.entity';
import { RsvpExtraFieldType } from 'src/common/type/common.type';
import { Column, Entity, ManyToOne } from 'typeorm';
import { WidgetConfigModel } from './widget-config.entity';

@Entity()
export class RsvpExtraFieldModel extends BaseModel {
  @Column()
  label: string;

  @Column()
  needResponseRejected: boolean;

  @Column('simple-array')
  options: string[];

  @Column()
  placeholder: string;

  @Column()
  type: RsvpExtraFieldType;

  @ManyToOne(() => WidgetConfigModel, (config) => config.extraFields, {
    // cascade: true,
    onDelete: 'CASCADE',
  })
  config: WidgetConfigModel;
}
