import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReqRes } from 'src/auth/decorator/req-res.decorator';
import { RequestWithUser } from 'src/common/type/common.type';
import { CreateWidgetDto } from 'src/widget/dto/create-widget.dto';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { ReadOrderDto } from './dto/read-order.dto';
import { UpdateDesignDto } from './dto/update-design.dto';
import { UpdateEventInfoDto } from './dto/update-event-info.dto';
import { UpdateMetaDto } from './dto/update-meta.dto';
import { UpdateOwnersDto } from './dto/update-owners.dto';
import { InvitationService } from './invitation.service';

@Controller('invitations')
@ApiTags('청첩장')
@ApiBearerAuth()
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Get(':id')
  @ApiOperation({ summary: '청첩장 조회' })
  async getInvitation(@Param('id') id: string) {
    return this.invitationService.readInvitation(id);
  }

  @Get()
  @ApiOperation({ summary: '나의 청첩장 목록 조회' })
  async getInvitations(@ReqRes() { req }: { req: RequestWithUser }) {
    return this.invitationService.readInvitations(req.user.id);
  }

  @Post()
  @ApiOperation({ summary: '청첩장 생성' })
  async postInvitation(
    @ReqRes() { req }: { req: RequestWithUser },
    @Body() body: CreateInvitationDto,
  ) {
    return await this.invitationService.createInvitation(req.user.id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: '청첩장 삭제' })
  async deleteInvitation(@Param('id') id: string) {
    return this.invitationService.deleteInvitation(id);
  }

  @Put(':id/event-info')
  @ApiOperation({ summary: '청첩장 일정 및 장소 수정' })
  async putEventInfo(
    @Param('id') id: string,
    @Body() body: UpdateEventInfoDto,
  ) {
    return this.invitationService.updateEventInfo(id, body);
  }

  @Put(':id/owners')
  @ApiOperation({ summary: '청첩장 혼주 정보 수정' })
  async putOwners(@Param('id') id: string, @Body() body: UpdateOwnersDto) {
    return this.invitationService.updateOwners(id, body);
  }

  @Put(':id/meta')
  @ApiOperation({ summary: '청첩장 메타정보 수정' })
  async putMeta(
    @Param('id') id: string,
    @Body() body: { meta: UpdateMetaDto },
  ) {
    return this.invitationService.updateMeta(id, body.meta);
  }

  @Put(':id/design')
  @ApiOperation({ summary: '청첩장 디자인 수정' })
  async putDesign(
    @Param('id') id: string,
    @Body() body: { design: UpdateDesignDto },
  ) {
    return this.invitationService.updateDesign(id, body.design);
  }

  @Put(':id/shares/visibility/on')
  @ApiOperation({ summary: '청첩장 공개하기' })
  async putShareOn(@Param('id') id: string) {
    return this.invitationService.createShareVisibilty(id);
  }

  @Put(':id/shares/visibility/off')
  @ApiOperation({ summary: '청첩장 숨기기' })
  async putShareOff(@Param('id') id: string) {
    return this.invitationService.offShareVisibilty(id);
  }

  @Post(':id/visit-logs')
  @ApiOperation({ summary: '청첩장 방문 로그 저장(하객)' })
  async postVisitLog(@Param('id') id: string) {
    return this.invitationService.updateOrCreateVisitsCount(id);
  }

  @Get(':id/visit-count-all')
  @ApiOperation({ summary: '청첩장 방문자수 조회' })
  async getVisitLogs(@Param('id') id: string) {
    return this.invitationService.readVisitLogs(id);
  }

  @Post(':id/duplicate')
  @ApiOperation({ summary: '청첩장 복제하기' })
  async postDuplicate(
    @ReqRes() { req }: { req: RequestWithUser },
    @Param('id') id: string,
  ) {
    return this.invitationService.cloneInvitation(req.user.id, id);
  }

  @Post(':id/widgets')
  @ApiTags('청첩장/위젯')
  @ApiOperation({ summary: '위젯 추가', tags: ['청첩장/위젯'] })
  async postWidget(@Param('id') id: string, @Body() body: CreateWidgetDto) {
    return this.invitationService.createWidget(id, body);
  }

  @Get(':id/order')
  @ApiOperation({ summary: '구매정보 불러오기' })
  async getOrderInfo(@Param('id') id: string, @Query() query: ReadOrderDto) {
    if (!query.orderType) throw new BadRequestException('orderType 필수');
    return this.invitationService.readOrder(id, query);
  }
}

@Controller('share/keys')
@ApiTags('청첩장/공유')
@ApiBearerAuth()
export class InvitationShareController {
  constructor(private readonly invitationService: InvitationService) {}

  @Get(':shareKey')
  @ApiOperation({ summary: '공유키로 청첩장 조회' })
  async getInvitationByShareKey(@Param('shareKey') shareKey: string) {
    return this.invitationService.readInvitationByShareKey(shareKey);
  }
}

// 더 연구하고 만들어야 할 것
// /orders/:id/confirm
// /orders/:id/confirm-free
// order는 테이블도 만들어야 함
