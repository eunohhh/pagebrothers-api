import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ImageModel } from 'src/common/entity/image.entity';
import { UsersModule } from 'src/users/users.module';
import { InvitationOwnerModel } from './entity/invitation-owner.entity';
import { InvitationModel } from './entity/invitation.entity';
import { WidgetConfigModel } from './entity/widget-config.entity';
import { WidgetItemModel } from './entity/widget-item.entity';
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
    ]),
    UsersModule,
    AuthModule,
  ],
  exports: [InvitationService],
  controllers: [InvitationController],
  providers: [InvitationService],
})
export class InvitationModule {}
