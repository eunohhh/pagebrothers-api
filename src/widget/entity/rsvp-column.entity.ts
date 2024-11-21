import { BaseModel } from 'src/common/entity/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class ColumnModel extends BaseModel {
  @Column({ nullable: false })
  title: string;
}
