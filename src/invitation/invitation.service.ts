import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateEventInfoDto } from './dto/update-event-info.dto';
import { UpdateOwnersDto } from './dto/update-owners.dto';
import { InvitationOwnerModel } from './entity/invitation-owner.entity';
import { InvitationModel } from './entity/invitation.entity';

@Injectable()
export class InvitationService {
  constructor(
    @InjectRepository(InvitationModel)
    private readonly invitationRepository: Repository<InvitationModel>,
    @InjectRepository(InvitationOwnerModel)
    private readonly invitationOwnerRepository: Repository<InvitationOwnerModel>,
  ) {}

  // 초대장 목록 조회
  async readInvitations(id: string) {
    if (!id) throw new BadRequestException('유저 아이디가 없습니다!');

    const result = await this.invitationRepository.find({
      where: { user: { id } },
      relations: {
        owners: true,
        widgets: true,
        images: true,
      },
    });

    const items = {
      items: result,
    };

    return items;
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
      relations: {
        owners: true,
        widgets: true,
        images: true,
      },
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
      relations: {
        owners: true,
        widgets: true,
        images: true,
      },
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
      relations: {
        owners: true,
        widgets: true,
        images: true,
      },
    });
  }

  // 초대장 삭제
  async deleteInvitation(id: string) {
    await this.invitationRepository.delete(id);
    return true;
  }
}
