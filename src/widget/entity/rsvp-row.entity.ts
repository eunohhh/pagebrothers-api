import { BaseModel } from 'src/common/entity/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { RowValueModel } from './rsvp-row-value.entity';

@Entity()
export class RowModel extends BaseModel {
  @Column()
  no: number;

  @Column({ default: false })
  accepted: boolean;

  @Column({ default: false })
  updated: boolean;

  @OneToMany(() => RowValueModel, (rowValue) => rowValue.row)
  rowValues: RowValueModel[];
}
