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
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { invitationExampleData } from 'src/invitation/data/invitation-example.data';
import {
  paginatedExampleData,
  rsvpAnswerExampleData,
  rsvpAnswersExampleData,
} from './data/example.data';
import { CreateCommentDto } from './dto/create-comment.dto';
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
  @ApiOperation({
    summary: '위젯 설정 수정',
    responses: {
      '200': {
        description: '위젯 설정 수정 성공',
        content: { 'application/json': { example: invitationExampleData } },
      },
    },
  })
  async putWidgetConfig(
    @Param('id') id: string,
    @Body() body: UpdateWidgetConfigDto,
  ) {
    return this.widgetService.updateWidgetConfig(id, body);
  }

  @Put(':id/index/:index')
  @ApiOperation({
    summary: '위젯 위치 수정',
    responses: {
      '200': {
        description: '위젯 위치 수정 성공',
        content: { 'application/json': { example: invitationExampleData } },
      },
    },
  })
  async putWidgetIndex(
    @Param('id') id: string,
    @Param('index', PositiveIntPipe) index: number,
  ) {
    return this.widgetService.updateWidgetIndex(id, index);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '위젯 삭제',
    responses: {
      '200': {
        description: '위젯 삭제 성공',
        content: { 'application/json': { example: invitationExampleData } },
      },
    },
  })
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
  @ApiOperation({
    summary: '나의 RSVP 응답 조회',
    responses: {
      '200': {
        description: '나의 RSVP 응답 조회 성공',
        content: { 'application/json': { example: rsvpAnswerExampleData } },
      },
    },
  })
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
  @ApiBody({
    description: '응답 제출 값',
    required: true,
    schema: {
      type: 'object',
      properties: {
        accepted: { type: 'boolean' },
        formValues: {
          type: 'object',
          properties: {
            guestMeal: { type: 'string' },
            guestCount: { type: 'number' },
            guestPhone: { type: 'number' },
            guestName: { type: 'string' },
            whosGuest: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiOperation({
    summary: '나의 RSVP 응답 제출',
    responses: {
      '200': { description: '나의 RSVP 응답 제출 성공' },
    },
  })
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
  @ApiOperation({
    summary: 'rsvp 응답 개수 조회',
    responses: {
      '200': {
        description: 'rsvp 응답 개수 조회 성공',
        content: {
          'application/json': {
            example: { acceptedCount: 10, rejectedCount: 5 },
          },
        },
      },
    },
  })
  async getRsvpAnswerCount(@Param('invitationId') invitationId: string) {
    return this.widgetService.readRsvpAnswerCount(invitationId);
  }

  @Get('answers')
  @ApiOperation({
    summary: 'rsvp 응답 결과 전체 조회',
    responses: {
      '200': {
        description: 'rsvp 응답 결과 전체 조회 성공',
        content: { 'application/json': { example: rsvpAnswersExampleData } },
      },
    },
  })
  async getRsvpAnswers(@Param('invitationId') invitationId: string) {
    return this.widgetService.readRsvpTableDataAnswers(invitationId);
  }
}

@Controller()
@ApiTags('청첩장/방명록')
@ApiBearerAuth()
export class WidgetCommentController {
  constructor(private readonly widgetService: WidgetService) {}

  @Get('invitations/:invitationId/comments')
  @ApiOperation({
    summary: '방명록 게시글 조회',
    responses: {
      '200': {
        description: '방명록 게시글 조회 성공',
        content: { 'application/json': { example: paginatedExampleData } },
      },
    },
  })
  async getCommentList(
    @Param('invitationId') invitationId: string,
    @Query('page', PositiveIntPipe) page: number,
    @Query('size', PositiveIntPipe) size: number,
    // @Query('sort') sort: string[],
  ) {
    if (page < 0 || size < 1)
      throw new BadRequestException('잘못된 페이지 번호입니다.');
    return this.widgetService.readCommentList(invitationId, page, size);
  }

  @Post('invitations/:invitationId/comments')
  @ApiOperation({
    summary: '방명록 게시글 작성',
    responses: {
      '200': {
        description: '방명록 게시글 작성 성공',
        content: {
          'application/json': {
            example: { id: '123e4567-e89b-12d3-a456-426614174000' },
          },
        },
      },
    },
  })
  async createComment(
    @Param('invitationId') invitationId: string,
    @Body() body: CreateCommentDto,
  ) {
    return this.widgetService.createComment(invitationId, body);
  }

  @Post('comments/:commentId/remove')
  @ApiBody({
    description: '비밀번호',
    required: true,
    schema: {
      type: 'object',
      properties: {
        password: {
          type: 'string',
        },
      },
    },
  })
  @ApiOperation({
    summary: '방명록 게시글 삭제',
    responses: {
      '200': { description: '방명록 게시글 삭제 성공' },
    },
  })
  async deleteComment(
    @Param('commentId') commentId: string,
    @Body('password') password: string,
  ) {
    return this.widgetService.deleteComment(commentId, password);
  }

  @Put('comments/:commentId')
  @ApiBody({
    description: '방명록 게시글 수정',
    required: true,
    schema: {
      type: 'object',
      properties: {
        body: {
          type: 'string',
        },
        password: {
          type: 'string',
        },
      },
    },
  })
  @ApiOperation({
    summary: '방명록 게시글 수정',
    responses: {
      '200': { description: '방명록 게시글 수정 성공' },
    },
  })
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() body: Pick<CreateCommentDto, 'body' | 'password'>,
  ) {
    return this.widgetService.updateComment(commentId, body);
  }
}
