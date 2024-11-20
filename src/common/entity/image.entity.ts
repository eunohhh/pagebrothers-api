import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';
import { join } from 'path';
import { InvitationModel } from 'src/invitation/entity/invitation.entity';
import { WidgetConfigModel } from 'src/widget/entity/widget-config.entity';
import { Column, Entity, ManyToMany } from 'typeorm';
import { POST_PUBLIC_IMAGE_PATH } from '../const/path.const';
import { BaseModel } from './base.entity';

export enum ImageModelType {
  POST_IMAGE,
}

@Entity()
export class ImageModel extends BaseModel {
  @Column()
  @IsString()
  @Transform(({ value }) => {
    if (value.includes('s3')) return value;
    return `/${join(POST_PUBLIC_IMAGE_PATH, value)}`;
  })
  url: string;

  @Column({ type: 'jsonb' })
  dimensions: {
    width: number;
    height: number;
  };

  @ManyToMany(() => InvitationModel, (invitation) => invitation.images)
  invitations?: InvitationModel[];

  @ManyToMany(() => WidgetConfigModel, (config) => config.coverImage)
  coverImage?: WidgetConfigModel[];

  @ManyToMany(() => WidgetConfigModel, (config) => config.singleItem)
  singleItem?: WidgetConfigModel[];
}
