import { Expose } from 'class-transformer';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseModel {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Expose()
  @UpdateDateColumn()
  updatedAt: Date;

  @Expose()
  @CreateDateColumn()
  createdAt: Date;
}
