import { Exclude } from 'class-transformer';
import { InvitationModel } from 'src/invitation/entity/invitation.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class CommentModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  author: string;

  @Column()
  authorProfileImage: string;

  @Column()
  body: string;

  @Column({ type: 'jsonb', default: '[]' })
  children: CommentModel[];

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @ManyToOne(() => InvitationModel, (invitation) => invitation.comments)
  @JoinColumn()
  invitation: InvitationModel;
}
