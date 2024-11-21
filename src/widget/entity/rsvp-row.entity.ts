import { BaseModel } from 'src/common/entity/base.entity';
import { InvitationModel } from 'src/invitation/entity/invitation.entity';
import { Column, Entity, Generated, ManyToOne, OneToMany } from 'typeorm';
import { RowValueModel } from './rsvp-row-value.entity';

@Entity()
export class RowModel extends BaseModel {
  @Column()
  @Generated('increment')
  no: number;

  @Column({ default: false, nullable: true })
  accepted?: boolean;

  @Column({ default: false, nullable: true })
  updated?: boolean;

  @OneToMany(() => RowValueModel, (rowValue) => rowValue.row)
  rowValues: RowValueModel[];

  @ManyToOne(() => InvitationModel, (invitation) => invitation.id, {
    onDelete: 'CASCADE',
  })
  invitation: InvitationModel;
}
