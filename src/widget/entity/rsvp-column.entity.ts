import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RowValueModel } from './rsvp-row-value.entity';

@Entity()
export class ColumnModel {
  @PrimaryColumn()
  id: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: false })
  title: string;

  @OneToMany(() => RowValueModel, (rowValue) => rowValue.column)
  rowValues: RowValueModel[];
}
