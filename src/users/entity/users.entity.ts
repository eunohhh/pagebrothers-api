import { Exclude } from 'class-transformer';
import { Providers } from 'src/common/const/provider.const';
import { BaseModel } from 'src/common/entity/base.entity';
import { InvitationModel } from 'src/invitation/entity/invitation.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
// 여기에 Exclude 하고 각 프로퍼티에 Expose 해서 기본으로 막고 노출할 것만 노출할 수도 있음
// @Exclude()
export class UsersModel extends BaseModel {
  @Column({
    unique: true,
  })
  email: string;

  @Column()
  name: string;

  @Column()
  profileImage: string;

  @Column({
    type: 'enum',
    enum: Providers,
  })
  provider: Providers;

  @Column()
  providerId: string;

  @Column()
  acceptMarketing: boolean;

  @Column({
    default: false,
  })
  @Exclude({
    toPlainOnly: true,
  })
  isAdmin: boolean;

  @OneToMany(() => InvitationModel, (invitation) => invitation.user)
  invitations: InvitationModel[];
}
