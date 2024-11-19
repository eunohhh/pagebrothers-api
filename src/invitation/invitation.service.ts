import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateDesignDto } from './dto/update-design.dto';
import { UpdateEventInfoDto } from './dto/update-event-info.dto';
import { UpdateMetaDto } from './dto/update-meta.dto';
import { UpdateOwnersDto } from './dto/update-owners.dto';
import { InvitationDesignModel } from './entity/invitation-design.entity';
import { InvitationMetaModel } from './entity/invitation-meta.entity';
import { InvitationOwnerModel } from './entity/invitation-owner.entity';
import { InvitationModel } from './entity/invitation.entity';
import { VisitsCountModel } from './entity/visits-count.entity';

const relations = {
  owners: true,
  widgets: true,
  images: true,
  meta: true,
  design: true,
};

@Injectable()
export class InvitationService {
  constructor(
    @InjectRepository(InvitationModel)
    private readonly invitationRepository: Repository<InvitationModel>,
    @InjectRepository(InvitationOwnerModel)
    private readonly invitationOwnerRepository: Repository<InvitationOwnerModel>,
    @InjectRepository(InvitationMetaModel)
    private readonly invitationMetaRepository: Repository<InvitationMetaModel>,
    @InjectRepository(InvitationDesignModel)
    private readonly invitationDesignRepository: Repository<InvitationDesignModel>,
    @InjectRepository(VisitsCountModel)
    private readonly visitsCountRepository: Repository<VisitsCountModel>,
  ) {}

  // 초대장 목록 조회
  async readInvitations(id: string) {
    if (!id) throw new BadRequestException('유저 아이디가 없습니다!');

    const result = await this.invitationRepository.find({
      where: { user: { id } },
      relations,
    });

    return {
      items: result,
    };
  }

  // 초대장 생성
  async createInvitation(id: string, body: CreateInvitationDto) {
    if (!id) throw new BadRequestException('유저 아이디가 없습니다!');

    if (!body.owners) throw new BadRequestException('주인 정보가 없습니다!');

    const invitation = await this.invitationRepository.create({
      user: { id },
      eventAt: body.eventAt
        ? body.eventAt
        : new Date(new Date().setMonth(new Date().getMonth() + 1)),
      fullDaySchedule: body.fullDaySchedule ?? false,
      location: {
        address: body.location.address ?? '서울특별시 중구 태평로1가 31',
        roadAddress: body.location.roadAddress ?? '서울 중구 세종대로 110',
        placeName: body.location.placeName ?? '태평홀',
        placeDetail: body.location.placeDetail ?? '서울시민청',
        coord: body.location.coord ?? [126.978563388844, 37.5668778859271],
        placeId: body.location.placeId ?? null,
        mapType: body.location.mapType ?? null,
      },
      templateId: body.templateId ?? '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    });
    const savedInvitation = await this.invitationRepository.save(invitation);

    const owners = body.owners.map((owner) => ({
      name: owner.name,
      role: owner.role,
      invitation: {
        id: savedInvitation.id,
      },
    }));

    await this.invitationOwnerRepository.save(owners);

    return await this.invitationRepository.findOne({
      where: { id: savedInvitation.id },
      relations,
    });
  }

  // 초대장 이벤트 정보 수정
  async updateEventInfo(id: string, body: UpdateEventInfoDto) {
    if (!id) throw new BadRequestException('초대장 아이디가 없습니다!');

    const invitation = await this.invitationRepository.findOneBy({ id });

    if (!invitation) throw new NotFoundException('초대장 정보가 없습니다!');

    await this.invitationRepository.update(id, body);
    return await this.invitationRepository.findOne({
      where: { id },
      relations,
    });
  }

  // 초대장 주인(결혼식 당사자) 수정
  async updateOwners(id: string, body: UpdateOwnersDto) {
    if (!id) throw new BadRequestException('초대장 아이디가 없습니다!');

    const invitation = await this.invitationRepository.findOneBy({ id });

    if (!invitation) throw new NotFoundException('초대장 정보가 없습니다!');

    if (!body.owners) throw new BadRequestException('주인 정보가 없습니다!');

    const owners = body.owners.map((owner) => ({
      name: owner.name,
      role: owner.role,
      invitation: {
        id: invitation.id,
      },
    }));

    // 그냥 save 하지말고 덮어쓰기
    await this.invitationOwnerRepository.delete({
      invitation: { id: invitation.id },
    });
    await this.invitationOwnerRepository.save(owners);

    return await this.invitationRepository.findOne({
      where: { id },
      relations,
    });
  }

  // 초대장 삭제
  async deleteInvitation(id: string) {
    await this.invitationRepository.delete(id);
    return true;
  }

  // 초대장 메타 정보 수정
  async updateMeta(id: string, body: UpdateMetaDto) {
    const invitationMeta = await this.invitationMetaRepository.findOneBy({
      invitation: { id },
    });

    if (!invitationMeta) {
      // 기존 메타 정보가 없으면 새로 생성
      await this.invitationMetaRepository.save({
        ...body,
        invitation: { id },
      });
    } else {
      // 기존 메타 정보가 있으면 업데이트
      await this.invitationMetaRepository.update(
        { id: invitationMeta.id },
        {
          ...body,
          invitation: { id },
        },
      );
    }

    return await this.invitationRepository.findOne({
      where: { id },
      relations,
    });
  }

  // 초대장 디자인 정보 수정
  async updateDesign(id: string, body: UpdateDesignDto) {
    const invitationDesign = await this.invitationDesignRepository.findOneBy({
      invitation: { id },
    });

    if (!invitationDesign) {
      await this.invitationDesignRepository.save({
        ...body,
        invitation: { id },
      });
    } else {
      await this.invitationDesignRepository.update(
        { id: invitationDesign.id },
        {
          ...body,
          invitation: { id },
        },
      );
    }

    return await this.invitationRepository.findOne({
      where: { id },
      relations,
    });
  }

  async updateOrCreateVisitsCount(id: string) {
    const visitsCount = await this.visitsCountRepository.findOneBy({
      invitation: { id },
    });

    if (!visitsCount) {
      await this.visitsCountRepository.save({
        invitation: { id },
        count: 1,
      });
    } else {
      await this.visitsCountRepository.update(visitsCount.id, {
        count: () => 'count + 1',
      });
    }
    return true;
  }

  async readVisitLogs(id: string) {
    return await this.visitsCountRepository.find({
      where: { invitation: { id } },
    });
  }
}
