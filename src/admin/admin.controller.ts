import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { invitationExampleData } from 'src/invitation/data/invitation-example.data';
import { AdminService } from './admin.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { ReadTemplatesQueryDto } from './dto/read-template.dto';
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
}
