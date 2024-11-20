import { BadRequestException, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as multer from 'multer'; // 이렇게 해야 에러 안남
import { extname } from 'path';
import { InvitationModel } from 'src/invitation/entity/invitation.entity';
import { InvitationModule } from 'src/invitation/invitation.module';
import { v4 as uuid } from 'uuid';
import { CommonController } from './common.controller';
import { CommonService } from './common.service';
import { TEMP_FOLDER_PATH } from './const/path.const';
import { ImageModel } from './entity/image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ImageModel, InvitationModel]),
    InvitationModule,
    MulterModule.register({
      limits: {
        // 바이트입력
        fileSize: 10000000,
      },
      fileFilter: (req, file, callback) => {
        /**
         * callback(error, boolean)
         */
        const extension = extname(file.originalname);
        if (
          extension !== '.jpg' &&
          extension !== '.jpeg' &&
          extension !== '.png' &&
          extension !== '.webp'
        ) {
          return callback(
            new BadRequestException('jpg/jpeg/png/webp 만 가능'),
            false,
          );
        }
        return callback(null, true);
      },
      storage: multer.diskStorage({
        destination: function (req, res, callback) {
          callback(null, TEMP_FOLDER_PATH);
        },
        filename: function (req, file, callback) {
          callback(null, `${uuid()}${extname(file.originalname)}`);
        },
      }),
    }),
  ],
  controllers: [CommonController],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
