import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { CreateRsvpAnswerDto } from './dto/create-rsvp-answer.dto';
import { UpdateWidgetConfigDto } from './dto/update-widget-config.dto';
import { PositiveIntPipe } from './pipe/positive-int.pipe';
import { WidgetService } from './widget.service';

@Controller('widgets')
@ApiTags('청첩장/위젯')
@ApiBearerAuth()
export class WidgetController {
  constructor(private readonly widgetService: WidgetService) {}

  @Put(':id/config')
  @ApiOperation({ summary: '위젯 설정 수정' })
  async putWidgetConfig(
    @Param('id') id: string,
    @Body() body: { config: UpdateWidgetConfigDto },
  ) {
    return this.widgetService.updateWidgetConfig(id, body.config);
  }

  @Put(':id/index/:index')
  @ApiOperation({ summary: '위젯 위치 수정' })
  async putWidgetIndex(
    @Param('id') id: string,
    @Param('index', PositiveIntPipe) index: number,
  ) {
    return this.widgetService.updateWidgetIndex(id, index);
  }

  @Delete(':id')
  @ApiOperation({ summary: '위젯 삭제' })
  async deleteWidget(@Param('id') id: string) {
    return this.widgetService.deleteWidget(id);
  }
}

@Controller('invitations/:invitationId/rsvp')
@ApiTags('청첩장/RSVP')
@ApiBearerAuth()
export class WidgetRsvpController {
  constructor(
    private readonly widgetService: WidgetService,
    private readonly authService: AuthService,
  ) {}

  @Get('answers')
  @ApiOperation({
    summary: 'rsvp 응답 결과들 조회',
  })
  async getRsvpTableDataAnswers(@Param('invitationId') invitationId: string) {
    return this.widgetService.readRsvpTableDataAnswers(invitationId);
  }

  @Get('answer')
  @ApiOperation({ summary: '나의 RSVP 응답 조회' })
  async getMyRsvpAnswer(
    @Req() req: Request,
    @Param('invitationId') invitationId: string,
  ) {
    const cookie = req.cookies || {};
    const sessionId = cookie._ps_ut;

    if (
      !sessionId ||
      !(await this.authService.validateCookie(invitationId, sessionId))
    ) {
      const token = await this.authService.createHash(invitationId);
      req.res.cookie('_ps_ut', token, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1주일
        sameSite: 'strict',
      });

      return {
        answered: false,
        data: null,
      };
    }

    // 유효한 쿠키가 있는 경우 데이터 반환
    return await this.widgetService.readMyRsvpAnswer(invitationId, sessionId);
  }

  @Post('answer')
  @ApiOperation({ summary: '나의 RSVP 응답 제출' })
  async createMyRsvpAnswer(
    @Req() req: Request,
    @Param('invitationId') invitationId: string,
    @Body() body: CreateRsvpAnswerDto,
  ) {
    const cookie = req.cookies || {};
    const sessionId = cookie._ps_ut;

    if (!sessionId) throw new BadRequestException('쿠키가 없습니다.');

    if (!(await this.authService.validateCookie(invitationId, sessionId))) {
      throw new BadRequestException('쿠키가 유효하지 않습니다.');
    }

    return this.widgetService.createMyRsvpAnswer(invitationId, sessionId, body);
  }

  @Get('answer-count')
  @ApiOperation({ summary: 'rsvp 응답 개수 조회' })
  async getRsvpAnswerCount(@Param('invitationId') invitationId: string) {
    return this.widgetService.readRsvpAnswerCount(invitationId);
  }

  @Get('answers')
  @ApiOperation({ summary: 'rsvp 응답 결과 전체 조회' })
  async getRsvpAnswers(@Param('invitationId') invitationId: string) {
    return this.widgetService.readRsvpTableDataAnswers(invitationId);
  }
}
