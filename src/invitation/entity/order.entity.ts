import { Exclude } from 'class-transformer';
import { BaseModel } from 'src/common/entity/base.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { InvitationModel } from './invitation.entity';

// 이 엔티티는 있을 수도 있고 없을 수도 있고
// invitation_model -> 청첩장 생성 시 생성되고 청첩장 삭제 시 삭제됨
@Entity()
export class OrderModel extends BaseModel {
  @Column()
  plan: string = 'FOREVER_SHARE';

  @Column()
  orderName: string = '평생 소장';

  @Column()
  amount: number = 24000;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  paymentKey: string;

  @Column()
  originAmount: number = 50000;

  @Column({ nullable: true })
  expiredAt?: Date;

  @Column({ nullable: true })
  couponCode?: string;

  @Column()
  isFreeOrder: boolean = false;

  @OneToOne(() => InvitationModel, (invitation) => invitation.order, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  invitation: InvitationModel;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  isPaymentCompleted: boolean;
}
