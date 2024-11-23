import { InvitationModel } from 'src/invitation/entity/invitation.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { RowValueModel } from './rsvp-row-value.entity';
@Entity()
export class RowModel {
  @PrimaryColumn()
  id: string = uuid();

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @Generated('increment')
  no: number;

  @Column({ default: false, nullable: true })
  accepted?: boolean;

  @Column({ default: false, nullable: true })
  updated?: boolean;

  @Column()
  sessionHash: string;

  @OneToMany(() => RowValueModel, (rowValue) => rowValue.row, {
    cascade: true,
  })
  rowValues: RowValueModel[];

  @ManyToOne(() => InvitationModel, (invitation) => invitation.id, {
    onDelete: 'CASCADE',
  })
  invitation: InvitationModel;
}
