import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageModel } from 'src/common/entity/image.entity';
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
  InvitationShareController,
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
    ]),
    WidgetModule,
  ],
  exports: [InvitationService],
  controllers: [InvitationController, InvitationShareController],
  providers: [InvitationService],
})
export class InvitationModule {}
