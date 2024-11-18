import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { InvitationModule } from 'src/invitation/invitation.module';
import { UsersModule } from 'src/users/users.module';
import { CommonController } from './common.controller';
import { CommonService } from './common.service';

@Module({
  imports: [InvitationModule, AuthModule, UsersModule],
  controllers: [CommonController],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
