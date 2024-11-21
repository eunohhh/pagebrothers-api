import { BaseModel } from 'src/common/entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ColumnModel } from './rsvp-column.entity';
import { RowModel } from './rsvp-row.entity';

@Entity()
export class RowValueModel extends BaseModel {
  @ManyToOne(() => RowModel, (row) => row.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'rowId' })
  row: RowModel;

  @ManyToOne(() => ColumnModel, (column) => column.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'columnId' })
  column: ColumnModel;

  @Column({ type: 'text', nullable: false })
  value: string;
}
