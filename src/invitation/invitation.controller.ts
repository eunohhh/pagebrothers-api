import {
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
import {
  invitationExampleData,
  orderExampleData,
} from './data/invitation-example.data';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { CreateOrderConfirmDto } from './dto/create-order-confirm.dto';
import { ReadOrderDto } from './dto/read-order.dto';
import { UpdateDesignDto } from './dto/update-design.dto';
import { UpdateEventInfoDto } from './dto/update-event-info.dto';
import { UpdateMetaDto } from './dto/update-meta.dto';
import { UpdateOwnersDto } from './dto/update-owners.dto';
import { InvitationService } from './invitation.service';

@Controller({
  path: 'invitations',
  version: '2',
})
@ApiTags('청첩장')
@ApiBearerAuth()
export class InvitationV2Controller {
  constructor(private readonly invitationService: InvitationService) {}
  @Get(':id')
  @ApiOperation({
    summary: '청첩장 조회',
    responses: {
      '200': {
        description: '청첩장 조회 성공',
        content: {
          'application/json': {
            example: invitationExampleData,
          },
        },
      },
    },
  })
  async getInvitation(@Param('id') id: string) {
    return this.invitationService.readInvitation(id);
  }

  @Get()
  @ApiOperation({
    summary: '나의 청첩장 목록 조회',
    responses: {
      '200': {
        description: '나의 청첩장 목록 조회 성공',
        content: {
          'application/json': {
            example: {
              items: [invitationExampleData],
            },
          },
        },
      },
    },
  })
  async getInvitations(@ReqRes() { req }: { req: RequestWithUser }) {
    return this.invitationService.readInvitations(req.user.id);
  }

  @Post()
  @ApiOperation({
    summary: '청첩장 생성',
    responses: {
      '200': {
        description: '청첩장 생성 성공',
        content: {
          'application/json': {
            example: { id: '3fa85f64-5717-4562-b3fc-2c963f66afa6' },
          },
        },
      },
    },
  })
  async postInvitation(
    @ReqRes() { req }: { req: RequestWithUser },
    @Body() body: CreateInvitationDto,
  ) {
    return await this.invitationService.createInvitation(req.user.id, body);
  }

  @Put(':id/event-info')
  @ApiOperation({
    summary: '청첩장 일정 및 장소 수정',
    responses: {
      '200': {
        description: '청첩장 일정 및 장소 수정 성공',
        content: {
          'application/json': {
            example: invitationExampleData,
          },
        },
      },
    },
  })
  async putEventInfo(
    @Param('id') id: string,
    @Body() body: UpdateEventInfoDto,
  ) {
    return this.invitationService.updateEventInfo(id, body);
  }

  @Put(':id/owners')
  @ApiOperation({
    summary: '청첩장 혼주 정보 수정',
    responses: {
      '200': {
        description: '청첩장 혼주 정보 수정 성공',
        content: { 'application/json': { example: invitationExampleData } },
      },
    },
  })
  async putOwners(@Param('id') id: string, @Body() body: UpdateOwnersDto) {
    return this.invitationService.updateOwners(id, body);
  }

  @Put(':id/meta')
  @ApiOperation({
    summary: '청첩장 메타정보 수정',
    responses: {
      '200': {
        description: '청첩장 메타정보 수정 성공',
        content: { 'application/json': { example: invitationExampleData } },
      },
    },
  })
  async putMeta(@Param('id') id: string, @Body() body: UpdateMetaDto) {
    return this.invitationService.updateMeta(id, body);
  }

  @Put(':id/design')
  @ApiOperation({
    summary: '청첩장 디자인 수정',
    responses: {
      '200': {
        description: '청첩장 디자인 수정 성공',
        content: { 'application/json': { example: invitationExampleData } },
      },
    },
  })
  async putDesign(@Param('id') id: string, @Body() body: UpdateDesignDto) {
    return this.invitationService.updateDesign(id, body);
  }
}

@Controller('invitations')
@ApiTags('청첩장')
@ApiBearerAuth()
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  // @Get(':id')
  // @ApiOperation({
  //   summary: '청첩장 조회',
  //   responses: {
  //     '200': {
  //       description: '청첩장 조회 성공',
  //       content: {
  //         'application/json': {
  //           example: invitationExampleData,
  //         },
  //       },
  //     },
  //   },
  // })
  // async getInvitation(@Param('id') id: string) {
  //   return this.invitationService.readInvitation(id);
  // }

  // @Get()
  // @ApiOperation({
  //   summary: '나의 청첩장 목록 조회',
  //   responses: {
  //     '200': {
  //       description: '나의 청첩장 목록 조회 성공',
  //       content: {
  //         'application/json': {
  //           example: {
  //             items: [invitationExampleData],
  //           },
  //         },
  //       },
  //     },
  //   },
  // })
  // async getInvitations(@ReqRes() { req }: { req: RequestWithUser }) {
  //   return this.invitationService.readInvitations(req.user.id);
  // }

  // @Post()
  // @ApiOperation({
  //   summary: '청첩장 생성',
  //   responses: {
  //     '200': {
  //       description: '청첩장 생성 성공',
  //       content: {
  //         'application/json': {
  //           example: { id: '3fa85f64-5717-4562-b3fc-2c963f66afa6' },
  //         },
  //       },
  //     },
  //   },
  // })
  // async postInvitation(
  //   @ReqRes() { req }: { req: RequestWithUser },
  //   @Body() body: CreateInvitationDto,
  // ) {
  //   return await this.invitationService.createInvitation(req.user.id, body);
  // }

  @Delete(':id')
  @ApiOperation({
    summary: '청첩장 삭제',
    responses: { '200': { description: '청첩장 삭제 성공' } },
  })
  async deleteInvitation(@Param('id') id: string) {
    return this.invitationService.deleteInvitation(id);
  }

  // @Put(':id/event-info')
  // @ApiOperation({
  //   summary: '청첩장 일정 및 장소 수정',
  //   responses: {
  //     '200': {
  //       description: '청첩장 일정 및 장소 수정 성공',
  //       content: {
  //         'application/json': {
  //           example: invitationExampleData,
  //         },
  //       },
  //     },
  //   },
  // })
  // async putEventInfo(
  //   @Param('id') id: string,
  //   @Body() body: UpdateEventInfoDto,
  // ) {
  //   return this.invitationService.updateEventInfo(id, body);
  // }

  // @Put(':id/owners')
  // @ApiOperation({
  //   summary: '청첩장 혼주 정보 수정',
  //   responses: {
  //     '200': {
  //       description: '청첩장 혼주 정보 수정 성공',
  //       content: { 'application/json': { example: invitationExampleData } },
  //     },
  //   },
  // })
  // async putOwners(@Param('id') id: string, @Body() body: UpdateOwnersDto) {
  //   return this.invitationService.updateOwners(id, body);
  // }

  // @Put(':id/meta')
  // @ApiOperation({
  //   summary: '청첩장 메타정보 수정',
  //   responses: {
  //     '200': {
  //       description: '청첩장 메타정보 수정 성공',
  //       content: { 'application/json': { example: invitationExampleData } },
  //     },
  //   },
  // })
  // async putMeta(@Param('id') id: string, @Body() body: UpdateMetaDto) {
  //   return this.invitationService.updateMeta(id, body);
  // }

  // @Put(':id/design')
  // @ApiOperation({
  //   summary: '청첩장 디자인 수정',
  //   responses: {
  //     '200': {
  //       description: '청첩장 디자인 수정 성공',
  //       content: { 'application/json': { example: invitationExampleData } },
  //     },
  //   },
  // })
  // async putDesign(@Param('id') id: string, @Body() body: UpdateDesignDto) {
  //   return this.invitationService.updateDesign(id, body);
  // }

  @Put(':id/shares/visibility/on')
  @ApiOperation({
    summary: '청첩장 공개하기',
    responses: { '200': { description: '청첩장 공개하기 성공' } },
  })
  async putShareOn(@Param('id') id: string) {
    return this.invitationService.createShareVisibility(id);
  }

  @Put(':id/shares/visibility/off')
  @ApiOperation({
    summary: '청첩장 숨기기',
    responses: { '200': { description: '청첩장 숨기기 성공' } },
  })
  async putShareOff(@Param('id') id: string) {
    return this.invitationService.offShareVisibilty(id);
  }

  @Post(':id/visit-logs')
  @ApiOperation({
    summary: '청첩장 방문 로그 저장(하객)',
    responses: { '200': { description: '청첩장 방문 로그 저장 성공' } },
  })
  async postVisitLog(@Param('id') id: string) {
    return this.invitationService.updateOrCreateVisitsCount(id);
  }

  @Get(':id/visit-count-all')
  @ApiOperation({
    summary: '청첩장 방문자수 조회',
    responses: {
      '200': {
        description: '청첩장 방문자수 조회 성공',
        content: { 'application/json': { example: { count: 0 } } },
      },
    },
  })
  async getVisitLogs(@Param('id') id: string) {
    return this.invitationService.readVisitLogs(id);
  }

  @Post(':id/duplicate')
  @ApiOperation({
    summary: '청첩장 복제하기',
    responses: {
      '200': {
        description: '청첩장 복제하기 성공',
        content: {
          'application/json': {
            example: { id: '3fa85f64-5717-4562-b3fc-2c963f66afa6' },
          },
        },
      },
    },
  })
  async postDuplicate(
    @ReqRes() { req }: { req: RequestWithUser },
    @Param('id') id: string,
  ) {
    return this.invitationService.cloneInvitation(req.user.id, id);
  }

  @Post(':id/widgets')
  @ApiTags('청첩장/위젯')
  @ApiOperation({
    summary: '위젯 추가',
    responses: {
      '200': {
        description: '위젯 추가 성공',
        content: {
          'application/json': {
            example: { id: '3fa85f64-5717-4562-b3fc-2c963f66afa6' },
          },
        },
      },
    },
  })
  async postWidget(@Param('id') id: string, @Body() body: CreateWidgetDto) {
    return this.invitationService.createWidget(id, body);
  }

  @Get(':id/order')
  @ApiTags('청첩장/구매')
  @ApiOperation({
    summary: '구매정보 불러오기',
    responses: {
      '200': {
        description: '구매정보 불러오기 성공',
        content: { 'application/json': { example: orderExampleData } },
      },
    },
  })
  async getOrderInfo(@Param('id') id: string, @Query() query: ReadOrderDto) {
    return this.invitationService.readOrder(id, query);
  }
}

@Controller({
  path: 'share/keys',
  version: '2',
})
@ApiTags('청첩장/공유')
@ApiBearerAuth()
export class InvitationShareController {
  constructor(private readonly invitationService: InvitationService) {}

  @Get(':shareKey')
  @ApiOperation({
    summary: '공유키로 청첩장 조회',
    responses: {
      '200': {
        description: '공유키로 청첩장 조회 성공',
        content: { 'application/json': { example: invitationExampleData } },
      },
    },
  })
  async getInvitationByShareKey(@Param('shareKey') shareKey: string) {
    return this.invitationService.readInvitationByShareKey(shareKey);
  }
}

@Controller('orders')
@ApiTags('청첩장/구매')
@ApiBearerAuth()
export class InvitationOrderController {
  constructor(private readonly invitationService: InvitationService) {}

  @Post(':orderId/confirm')
  @ApiOperation({
    summary: '구매완료',
    responses: { '200': { description: '구매완료 성공' } },
  })
  async postOrderConfirm(
    @Param('orderId') orderId: string,
    @Body() body: CreateOrderConfirmDto,
  ) {
    return this.invitationService.createOrderConfirm(orderId, body);
  }

  @Post(':orderId/confirm-free')
  @ApiOperation({
    summary: '(무료)구매완료',
    responses: { '200': { description: '무료구매완료 성공' } },
  })
  async postFreeOrderConfirm(@Param('orderId') orderId: string) {
    return this.invitationService.createFreeOrderConfirm(orderId);
  }
}
