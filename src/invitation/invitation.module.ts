import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';
import { ImageModel } from 'src/common/entity/image.entity';
import { UsersModel } from 'src/users/entity/users.entity';
import { CommentModel } from 'src/widget/entity/comment.entity';
import { ColumnModel } from 'src/widget/entity/rsvp-column.entity';
import { RsvpExtraFieldModel } from 'src/widget/entity/rsvp-extra-fields.entity';
import { WidgetModule } from 'src/widget/widget.module';
import { WidgetConfigModel } from '../widget/entity/widget-config.entity';
import { WidgetItemModel } from '../widget/entity/widget-item.entity';
import { InvitationDesignModel } from './entity/invitation-design.entity';
import { InvitationMetaModel } from './entity/invitation-meta.entity';
import { InvitationOwnerModel } from './entity/invitation-owner.entity';
import { InvitationModel } from './entity/invitation.entity';
import { OrderModel } from './entity/order.entity';
import { VisitsCountModel } from './entity/visits-count.entity';
import {
  InvitationController,
  InvitationOrderController,
  InvitationShareController,
  InvitationV2Controller,
} from './invitation.controller';
import { InvitationService } from './invitation.service';

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
      OrderModel,
      CommentModel,
      ColumnModel,
      UsersModel,
    ]),
    WidgetModule,
    CommonModule,
  ],
  exports: [InvitationService],
  controllers: [
    InvitationController,
    InvitationShareController,
    InvitationOrderController,
    InvitationV2Controller,
  ],
  providers: [InvitationService],
})
export class InvitationModule {}
