import { S3 } from '@aws-sdk/client-s3';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { promises } from 'fs';
import { basename, join } from 'path';
import * as sharp from 'sharp';
import { InvitationModel } from 'src/invitation/entity/invitation.entity';
import { QueryRunner, Repository } from 'typeorm';
import {
  ENV_AWS_ACCESS_KEY_ID,
  ENV_AWS_BUCKET_NAME,
  ENV_AWS_REGION,
  ENV_AWS_SECRET_ACCESS_KEY,
  ENV_ENV,
} from './const/env-keys.const';
import { POST_IMAGE_PATH, TEMP_FOLDER_PATH } from './const/path.const';
import { CreateImageDto } from './dto/create-image.dto';
import { ImageModel } from './entity/image.entity';

const relations = [
  'owners',
  'widgets',
  'widgets.config', // 중첩 관계 추가
  'images',
  'meta',
  'design',
];

@Injectable()
export class CommonService {
  private s3: S3;

  constructor(
    @InjectRepository(ImageModel)
    private readonly imageRepository: Repository<ImageModel>,
    @InjectRepository(InvitationModel)
    private readonly invitationRepository: Repository<InvitationModel>,
    private readonly configService: ConfigService,
  ) {
    // JS SDK v3 does not support global configuration.
    // Codemod has attempted to pass values to each service client in this file.
    // You may need to update clients outside of this file, if they use global config.
    // AWS.config.update({
    //   credentials: {
    //     accessKeyId: this.configService.get<string>(ENV_AWS_ACCESS_KEY_ID),
    //     secretAccessKey: this.configService.get<string>(
    //       ENV_AWS_SECRET_ACCESS_KEY,
    //     ),
    //   },
    //   region: this.configService.get<string>(ENV_AWS_REGION),
    // });
    this.s3 = new S3({
      credentials: {
        accessKeyId: this.configService.get<string>(ENV_AWS_ACCESS_KEY_ID),
        secretAccessKey: this.configService.get<string>(
          ENV_AWS_SECRET_ACCESS_KEY,
        ),
      },

      region: this.configService.get<string>(ENV_AWS_REGION),
    });
  }

  getRepositroy(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<ImageModel>(ImageModel)
      : this.imageRepository;
  }

  // 청첩장 첨부파일 생성
  async createImage(dto: CreateImageDto) {
    // S3에 업로드할 파일 이름 생성
    const s3Key = `images/${basename(dto.url)}`;

    try {
      // 로컬 파일 존재 확인
      const tempFilePath = join(TEMP_FOLDER_PATH, dto.url);
      await promises.access(tempFilePath);

      // 로컬 파일 읽기
      const fileContent = await promises.readFile(tempFilePath);

      // S3에 파일 업로드
      await this.s3.putObject({
        Bucket: this.configService.get<string>(ENV_AWS_BUCKET_NAME),
        Key: s3Key,
        Body: fileContent,
        ACL: 'public-read',
      });

      // 업로드 성공 후 로컬 파일 삭제
      await promises.unlink(tempFilePath);

      // 데이터베이스 저장
      const savedImage = await this.imageRepository.save({
        ...dto,
        url: `https://${this.configService.get<string>(
          ENV_AWS_BUCKET_NAME,
        )}.s3.${this.configService.get<string>(
          ENV_AWS_REGION,
        )}.amazonaws.com/${s3Key}`,
      });
      return savedImage;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'S3 업로드 중 문제가 발생했습니다.',
      );
    }
  }

  async createImageLocal(dto: CreateImageDto, qr?: QueryRunner) {
    const repository = this.getRepositroy(qr);
    const tempFilePath = join(TEMP_FOLDER_PATH, dto.url);

    try {
      // 파일이 존재하는지 확인
      // 만약에 존재하지 않으면 에러던짐
      await promises.access(tempFilePath);
    } catch {
      throw new BadRequestException('존재하지 않는 파일입니다');
    }

    // 파일의 이름만 가져오기
    const fileName = basename(tempFilePath);
    // 새로 이동할 post 폴더의 경로
    const newPath = join(POST_IMAGE_PATH, fileName);

    const result = await repository.save({
      ...dto,
    });
    // 파일 옮기기
    await promises.rename(tempFilePath, newPath);

    return result;
  }

  async uploadImage(
    filename: string,
    id: string,
    width?: number,
    height?: number,
  ) {
    const invitation = await this.invitationRepository.findOneBy({ id });
    if (!invitation) throw new NotFoundException('청첩장이 없습니다!');

    const filePath = `${TEMP_FOLDER_PATH}/${filename}`;

    const metadata = await sharp(filePath).metadata(); // 이미지 메타데이터 가져오기

    const imageObj = {
      invitations: [invitation],
      url: filename,
      dimensions: {
        width: metadata.width ?? 0,
        height: metadata.height ?? 0,
      },
    };

    if (width && height) {
      imageObj.dimensions = { width, height };
    }

    // await this.createImage(imageObj);

    if (this.configService.get<string>(ENV_ENV) === 'production') {
      await this.createImage(imageObj);
    } else {
      await this.createImageLocal(imageObj);
    }

    const finalInvitation = await this.invitationRepository.findOne({
      where: { id },
      relations,
    });
    return finalInvitation;
  }

  // 이미지 정보조회
  async readImageInfo(id: string) {
    const image = await this.imageRepository.findOneBy({ id });
    if (!image) throw new NotFoundException('이미지가 없습니다!');

    return image;
  }
}
