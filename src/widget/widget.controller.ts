import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { ReqRes } from 'src/auth/decorator/req-res.decorator';
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
    @ReqRes() { res, req }: { res: Response; req: Request },
    @Param('invitationId') invitationId: string,
  ) {
    const { _ps_ut: sessionId } = req.cookies;

    if (!sessionId) {
      const token = this.authService.createHash(invitationId);
      res.cookie('_ps_ut', token, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1주일
        sameSite: 'strict',
      });
    }

    if (this.authService.validateCookie(invitationId, sessionId)) {
      return this.widgetService.readMyRsvpAnswer(invitationId);
    }

    return res.status(200).json({
      answered: false,
      data: null,
    });
  }
}
