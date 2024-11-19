import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ReqRes } from 'src/auth/decorator/req-res.decorator';
import { BearerTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { RequestWithUser } from 'src/common/type/common.type';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateEventInfoDto } from './dto/update-event-info.dto';
import { UpdateMetaDto } from './dto/update-meta.dto';
import { UpdateOwnersDto } from './dto/update-owners.dto';
import { InvitationService } from './invitation.service';

@Controller('invitations')
@UseGuards(BearerTokenGuard)
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Get()
  async getInvitations(@ReqRes() { req }: { req: RequestWithUser }) {
    return this.invitationService.readInvitations(req.user.id);
  }

  @Post()
  async postInvitation(
    @ReqRes() { req }: { req: RequestWithUser },
    @Body() body: CreateInvitationDto,
  ) {
    const result = await this.invitationService.createInvitation(
      req.user.id,
      body,
    );

    return {
      id: result.id,
    };
  }
  @Delete(':id')
  async deleteInvitation(@Param('id') id: string) {
    return this.invitationService.deleteInvitation(id);
  }

  @Put(':id/event-info')
  async putEventInfo(
    @Param('id') id: string,
    @Body() body: UpdateEventInfoDto,
  ) {
    return this.invitationService.updateEventInfo(id, body);
  }

  @Put(':id/owners')
  async putOwners(@Param('id') id: string, @Body() body: UpdateOwnersDto) {
    return this.invitationService.updateOwners(id, body);
  }

  @Put(':id/meta')
  async putMeta(
    @Param('id') id: string,
    @Body() body: { meta: UpdateMetaDto },
  ) {
    return this.invitationService.updateMeta(id, body.meta);
  }
}
