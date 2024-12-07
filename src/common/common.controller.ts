import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AdminService } from 'src/admin/admin.service';
import { TemplateStage } from 'src/admin/dto/create-template.dto';
import { ReadTemplatesQueryDto } from 'src/admin/dto/read-template.dto';
import { invitationExampleData } from 'src/invitation/data/invitation-example.data';
import { CommonService } from './common.service';
import { ImageQueryDto } from './dto/image-query.dto';
import { TransactionInterceptor } from './interceptor/transaction.interceptor';

@Controller({
  path: '',
  version: '2',
})
@ApiTags('템플릿')
export class CommonV2Controller {
  constructor(private readonly adminService: AdminService) {}

  @Get('templates')
  @ApiQuery({
    name: 'stage',
    enum: TemplateStage,
  })
  @ApiOperation({
    summary: '모든 템플릿 조회',
    responses: {
      '200': {
        description: '모든 템플릿 조회 성공',
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
  async getTemplates(@Query() query: ReadTemplatesQueryDto) {
    const templates = await this.adminService.readAllTemplates();
    const filteredTemplates = templates.filter(
      (template) => template.stage === query.stage,
    );

    return filteredTemplates;
  }
}

@Controller()
@ApiTags('청첩장/첨부파일')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Post('/invitations/:id/images')
  @UseInterceptors(TransactionInterceptor)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data') // 요청 타입 지정
  @ApiBody({
    description: '이미지 파일 업로드',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary', // 파일 업로드 형식
        },
      },
    },
  })
  @ApiOperation({
    summary: '이미지 업로드',
    responses: {
      '200': {
        description: '이미지 업로드 성공',
        content: {
          'application/json': {
            example: {
              id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
              url: 'string',
              dimensions: {
                width: 0,
                height: 0,
              },
            },
          },
        },
      },
    },
  })
  postImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Query() query: ImageQueryDto,
  ) {
    if (!file) throw new BadRequestException('파일이 업로드되지 않았습니다.');

    return this.commonService.uploadImage(
      file.filename,
      id,
      query.width,
      query.height,
    );
  }

  @Get('/images/:id')
  @ApiOperation({
    summary: '이미지 정보 불러오기',
    responses: {
      '200': {
        description: '이미지 정보 불러오기 성공',
        content: {
          'application/json': {
            example: {
              id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
              url: 'string',
              dimensions: {
                width: 0,
                height: 0,
              },
            },
          },
        },
      },
    },
  })
  getImageInfo(@Param('id') id: string) {
    return this.commonService.readImageInfo(id);
  }
}
