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
import { ApiOperation } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { ReqRes } from 'src/auth/decorator/req-res.decorator';
import { RequestWithUser } from 'src/common/type/common.type';
import { invitationExampleData } from 'src/invitation/data/invitation-example.data';
import { AdminService } from './admin.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { ReadTemplatesQueryDto } from './dto/read-template.dto';
import { UpdateTemplateOrderDto } from './dto/update-template-order.dto';
import { UpdateTemplateStageDto } from './dto/update-template-stage.dto';
import { UpdateTemplateTitleDto } from './dto/update-template-title.dto';
import { UpdateUserRoleDto } from './dto/update-user.dto';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly authService: AuthService,
  ) {}

  @Get('templates')
  @ApiOperation({
    summary: '템플릿 조회',
    responses: {
      '200': {
        description: '템플릿 조회 성공',
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
  async readTemplates(@Query() query: ReadTemplatesQueryDto) {
    const templates = await this.adminService.readTemplates(query);

    return {
      items: templates,
    };
  }

  @Post('templates')
  @ApiOperation({
    summary: '템플릿 생성',
    responses: {
      '200': {
        description: '템플릿 생성 성공',
        content: {
          'application/json': {
            example: invitationExampleData,
          },
        },
      },
    },
  })
  async createTemplate(@Body() dto: CreateTemplateDto) {
    return this.adminService.createTemplate(dto);
  }

  @Post('update-user-role')
  @ApiOperation({
    summary: '유저 권한 업데이트',
    responses: {
      '200': {
        description: '유저 권한 업데이트 성공',
      },
    },
  })
  async updateUserRole(@Body() dto: UpdateUserRoleDto) {
    return this.authService.updateUserRole(dto);
  }

  @Put('templates/:id/stage')
  @ApiOperation({
    summary: '템플릿 등급 업데이트',
    responses: {
      '200': {
        description: '템플릿 등급 업데이트 성공',
      },
    },
  })
  async updateTemplateStage(
    @Param('id') id: string,
    @Body() dto: UpdateTemplateStageDto,
  ) {
    return this.adminService.updateTemplateStage(id, dto);
  }

  @Put('templates/:id/title')
  @ApiOperation({
    summary: '템플릿 타이틀 업데이트',
    responses: {
      '200': {
        description: '템플릿 타이틀 업데이트 성공',
      },
    },
  })
  async updateTemplateTitle(
    @Param('id') id: string,
    @Body() dto: UpdateTemplateTitleDto,
  ) {
    return this.adminService.updateTemplateTitle(id, dto);
  }

  @Delete('templates/:id')
  @ApiOperation({
    summary: '템플릿 삭제',
    responses: {
      '200': {
        description: '템플릿 삭제 성공',
      },
    },
  })
  async deleteTemplate(@Param('id') id: string) {
    return this.adminService.deleteTemplate(id);
  }

  @Get('invitations')
  @ApiOperation({
    summary: '모든 청첩장 조회',
  })
  async readAllInvitations() {
    return this.adminService.readAllInvitations();
  }

  @Get('invitations/:id')
  @ApiOperation({
    summary: '청첩장 조회',
  })
  async readInvitation(@Param('id') id: string) {
    return this.adminService.readInvitation(id);
  }

  @Get('users')
  @ApiOperation({
    summary: '유저 검색',
    responses: {
      '200': {
        description: '유저 검색 성공',
        content: {
          'application/json': {
            example: {
              users: [
                {
                  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                  name: 'string',
                  email: 'string',
                  profileImage: 'string',
                  provider: 'KAKAO',
                  providerId: 'string',
                  isAdmin: true,
                  createdAt: '2024-12-06T11:06:54.247Z',
                  updatedAt: '2024-12-06T11:06:54.247Z',
                },
              ],
            },
          },
        },
      },
    },
  })
  async searchUsers(@Query('query') query: string) {
    return this.adminService.searchUsers(query);
  }

  @Get('users/me')
  @ApiOperation({
    summary: '현재 어드민 유저 정보 가져오기',
    responses: {
      '200': {
        description: '현재 어드민 유저 정보 가져오기 성공',
        content: {
          'application/json': {
            example: {
              users: [
                {
                  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                  name: 'string',
                  email: 'string',
                  profileImage: 'string',
                  provider: 'KAKAO',
                  providerId: 'string',
                  isAdmin: true,
                },
              ],
            },
          },
        },
      },
    },
  })
  async getCurrentAdminUser(@ReqRes() { req }: { req: RequestWithUser }) {
    return this.adminService.getCurrentAdminUser(req.user.email);
  }

  @Get('statistics')
  @ApiOperation({
    summary: '사이트 통계 조회',
    responses: {
      '200': {
        description: '사이트 통계 조회 성공',
        content: {
          'application/json': {
            example: {
              totalInvitationCount: 0,
              totalUserCount: 0,
              totalSharedCount: 0,
              currentSharingCount: 0,
              sharedCountInThisMonth: 0,
              invitationCountInThisMonth: 0,
            },
          },
        },
      },
    },
  })
  async getSiteStatistics() {
    return this.adminService.getSiteStatus();
  }

  @Post('invitations/:id/duplicate')
  @ApiOperation({
    summary: '어드민에서 청첩장 복제',
    responses: {
      '200': {
        description: '어드민에서 청첩장 복제 성공',
      },
    },
  })
  async copyInvitation(@Param('id') id: string) {
    return this.adminService.copyInvitation(id);
  }

  @Put('templates/orders')
  @ApiOperation({
    summary: '템플릿 순서 수정',
    responses: {
      '200': {
        description: '템플릿 순서 수정 성공',
      },
    },
  })
  async updateTemplateOrder(@Body() dto: UpdateTemplateOrderDto) {
    return this.adminService.updateTemplateOrder(dto);
  }
}
