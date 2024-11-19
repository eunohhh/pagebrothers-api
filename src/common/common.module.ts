import { Module } from '@nestjs/common';
import { InvitationModule } from 'src/invitation/invitation.module';
import { CommonController } from './common.controller';
import { CommonService } from './common.service';

@Module({
  imports: [InvitationModule],
  controllers: [CommonController],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
