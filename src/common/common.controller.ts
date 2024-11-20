import {
  BadRequestException,
  Controller,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { QueryRunner as QR } from 'typeorm';
import { CommonService } from './common.service';
import { QueryRunner } from './decorator/query-runner.decorator';
import { ImageQueryDto } from './dto/image-query.dto';
import { TransactionInterceptor } from './interceptor/transaction.interceptor';

@Controller()
@ApiTags('청첩장/첨부파일')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Post('/invitations/:id/images')
  @UseInterceptors(TransactionInterceptor)
  @UseInterceptors(FileInterceptor('file'))
  postImage(
    @UploadedFile() file: Express.Multer.File,
    @QueryRunner() qr: QR,
    @Param('id') id: string,
    @Query() query: ImageQueryDto,
  ) {
    if (!file) throw new BadRequestException('파일이 업로드되지 않았습니다.');

    return this.commonService.uploadImage(
      file.filename,
      id,
      query.width,
      query.height,
      qr,
    );
  }
}
