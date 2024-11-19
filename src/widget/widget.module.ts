import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ImageModel } from 'src/common/entity/image.entity';
import { InvitationDesignModel } from 'src/invitation/entity/invitation-design.entity';
import { InvitationMetaModel } from 'src/invitation/entity/invitation-meta.entity';
import { InvitationOwnerModel } from 'src/invitation/entity/invitation-owner.entity';
import { InvitationModel } from 'src/invitation/entity/invitation.entity';
import { VisitsCountModel } from 'src/invitation/entity/visits-count.entity';
import { UsersModule } from 'src/users/users.module';
import { WidgetConfigModel } from './entity/widget-config.entity';
import { WidgetItemModel } from './entity/widget-item.entity';
import { WidgetController } from './widget.controller';
import { WidgetService } from './widget.service';

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
    ]),
    UsersModule,
    AuthModule,
  ],
  exports: [WidgetService],
  controllers: [WidgetController],
  providers: [WidgetService],
})
export class WidgetModule {}