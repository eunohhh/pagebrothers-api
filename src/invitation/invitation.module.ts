import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ImageModel } from 'src/common/entity/image.entity';
import { UsersModule } from 'src/users/users.module';
import { WidgetConfigModel } from '../widget/entity/widget-config.entity';
import { WidgetItemModel } from '../widget/entity/widget-item.entity';
import { InvitationDesignModel } from './entity/invitation-design.entity';
import { InvitationMetaModel } from './entity/invitation-meta.entity';
import { InvitationOwnerModel } from './entity/invitation-owner.entity';
import { InvitationModel } from './entity/invitation.entity';
import { VisitsCountModel } from './entity/visits-count.entity';
import { InvitationController } from './invitation.controller';
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
    ]),
    UsersModule,
    AuthModule,
  ],
  exports: [InvitationService],
  controllers: [InvitationController],
  providers: [InvitationService],
})
export class InvitationModule {}
