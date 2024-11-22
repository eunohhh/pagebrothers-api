import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ColumnModel } from './rsvp-column.entity';
import { RowModel } from './rsvp-row.entity';

@Entity()
export class RowValueModel {
  @PrimaryGeneratedColumn('uuid')
  originalId: string;

  @Column({ type: 'text' })
  id: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => RowModel, (row) => row.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  row: RowModel;

  @ManyToOne(() => ColumnModel, (column) => column.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  column: ColumnModel;

  @Column({ type: 'text', nullable: false })
  value: string | boolean | number;
}
