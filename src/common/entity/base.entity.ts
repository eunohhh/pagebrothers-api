import { Exclude, Expose } from 'class-transformer';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseModel {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @CreateDateColumn()
  createdAt: Date;
}
