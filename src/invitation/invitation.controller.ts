import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ReqRes } from 'src/auth/decorator/req-res.decorator';
import { BearerTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { RequestWithUser } from 'src/common/type/common.type';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { InvitationService } from './invitation.service';

@Controller('invitations')
@UseGuards(BearerTokenGuard)
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Get()
  async getInvitations(@ReqRes() { req }: { req: RequestWithUser }) {
    if (!req.user) throw new UnauthorizedException('유저 정보가 없습니다!');
    return this.invitationService.readInvitations(req.user.id);
  }

  @Post()
  async createInvitation(
    @ReqRes() { req }: { req: RequestWithUser },
    @Body() body: CreateInvitationDto,
  ) {
    if (!req.user) throw new UnauthorizedException('유저 정보가 없습니다!');
    const result = await this.invitationService.createInvitation(
      req.user.id,
      body,
    );

    return {
      id: result.id,
    };
  }
}
