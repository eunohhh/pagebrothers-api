import { Provider } from 'src/common/const/provider.const';
import { BaseModel } from 'src/common/entity/base.entity';
import { Column, Entity } from 'typeorm';

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
    enum: Provider,
  })
  provider: Provider;
}
