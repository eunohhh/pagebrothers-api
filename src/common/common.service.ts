import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { promises } from 'fs';
import { basename, join } from 'path';
import * as sharp from 'sharp';
import { InvitationModel } from 'src/invitation/entity/invitation.entity';
import { QueryRunner, Repository } from 'typeorm';
import { POST_IMAGE_PATH, TEMP_FOLDER_PATH } from './const/path.const';
import { CreatePostImageDto } from './dto/create-image.dto';
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
  constructor(
    @InjectRepository(ImageModel)
    private readonly imageRepository: Repository<ImageModel>,
    @InjectRepository(InvitationModel)
    private readonly invitationRepository: Repository<InvitationModel>,
  ) {}

  getRepositroy(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<ImageModel>(ImageModel)
      : this.imageRepository;
  }

  // 청첩장 첨부파일 생성
  async createPostImage(dto: CreatePostImageDto, qr?: QueryRunner) {
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
    qr?: QueryRunner,
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

    await this.createPostImage(imageObj, qr);

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
