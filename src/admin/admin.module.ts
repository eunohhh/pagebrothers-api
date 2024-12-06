import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ImageModel } from 'src/common/entity/image.entity';
import { InvitationDesignModel } from 'src/invitation/entity/invitation-design.entity';
import { InvitationMetaModel } from 'src/invitation/entity/invitation-meta.entity';
import { InvitationOwnerModel } from 'src/invitation/entity/invitation-owner.entity';
import { InvitationModel } from 'src/invitation/entity/invitation.entity';
import { OrderModel } from 'src/invitation/entity/order.entity';
import { VisitsCountModel } from 'src/invitation/entity/visits-count.entity';
import { InvitationModule } from 'src/invitation/invitation.module';
import { UsersModule } from 'src/users/users.module';
import { CommentModel } from 'src/widget/entity/comment.entity';
import { RsvpExtraFieldModel } from 'src/widget/entity/rsvp-extra-fields.entity';
import { WidgetConfigModel } from 'src/widget/entity/widget-config.entity';
import { WidgetItemModel } from 'src/widget/entity/widget-item.entity';
import { WidgetModule } from 'src/widget/widget.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TemplateModel } from './entity/template.entity';

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
      TemplateModel,
    ]),
    WidgetModule,
    InvitationModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
