import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import { ImageModel } from 'src/common/entity/image.entity';
import { InvitationDesignModel } from 'src/invitation/entity/invitation-design.entity';
import { InvitationMetaModel } from 'src/invitation/entity/invitation-meta.entity';
import { InvitationOwnerModel } from 'src/invitation/entity/invitation-owner.entity';
import { InvitationModel } from 'src/invitation/entity/invitation.entity';
import { VisitsCountModel } from 'src/invitation/entity/visits-count.entity';
import { UsersModel } from 'src/users/entity/users.entity';
import { CommentModel } from './entity/comment.entity';
import { ColumnModel } from './entity/rsvp-column.entity';
import { RsvpExtraFieldModel } from './entity/rsvp-extra-fields.entity';
import { RowValueModel } from './entity/rsvp-row-value.entity';
import { RowModel } from './entity/rsvp-row.entity';
import { WidgetConfigModel } from './entity/widget-config.entity';
import { WidgetItemModel } from './entity/widget-item.entity';
import {
  WidgetCommentController,
  WidgetController,
  WidgetRsvpController,
} from './widget.controller';
import { SeederService, WidgetService } from './widget.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InvitationModel,
      InvitationOwnerModel,
      ImageModel,
      WidgetConfigModel,
      WidgetItemModel,
      InvitationMetaModel,
      InvitationDesignModel,
      VisitsCountModel,
      RsvpExtraFieldModel,
      ColumnModel,
      RowModel,
      RowValueModel,
      CommentModel,
      UsersModel,
    ]),
    AuthModule,
    CommonModule,
  ],
  exports: [WidgetService, SeederService],
  controllers: [
    WidgetController,
    WidgetRsvpController,
    WidgetCommentController,
  ],
  providers: [WidgetService, SeederService],
})
export class WidgetModule {}
