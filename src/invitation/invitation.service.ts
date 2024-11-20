import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWidgetDto } from 'src/widget/dto/create-widget.dto';
import { WidgetConfigModel } from 'src/widget/entity/widget-config.entity';
import { WidgetItemModel } from 'src/widget/entity/widget-item.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { ReadOrderDto } from './dto/read-order.dto';
import { UpdateDesignDto } from './dto/update-design.dto';
import { UpdateEventInfoDto } from './dto/update-event-info.dto';
import { UpdateMetaDto } from './dto/update-meta.dto';
import { UpdateOwnersDto } from './dto/update-owners.dto';
import { InvitationDesignModel } from './entity/invitation-design.entity';
import { InvitationMetaModel } from './entity/invitation-meta.entity';
import { InvitationOwnerModel } from './entity/invitation-owner.entity';
import { InvitationModel } from './entity/invitation.entity';
import { VisitsCountModel } from './entity/visits-count.entity';
import { transformDateString } from './util/transform-date-string.util';

const relations = [
  'owners',
  'widgets',
  'widgets.config', // 중첩 관계 추가
  'images',
  'meta',
  'design',
];

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
    @InjectRepository(WidgetItemModel)
    private readonly widgetRepository: Repository<WidgetItemModel>,
    @InjectRepository(WidgetConfigModel)
    private readonly widgetConfigRepository: Repository<WidgetConfigModel>,
  ) {}

  // 청첩장 조회
  async readInvitation(id: string) {
    return await this.invitationRepository.findOne({
      where: { id },
      relations,
    });
  }

  // 청첩장 목록 조회
  async readInvitations(id: string) {
    if (!id) throw new BadRequestException('유저 아이디가 없습니다!');

    const result = await this.invitationRepository.find({
      where: { user: { id } },
      relations,
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      items: result,
    };
  }

  // 청첩장 생성
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

    const result = await this.invitationRepository.findOne({
      where: { id: savedInvitation.id },
      relations,
    });

    return {
      id: result.id,
    };
  }

  // 청첩장 이벤트 정보 수정
  async updateEventInfo(id: string, body: UpdateEventInfoDto) {
    if (!id) throw new BadRequestException('청첩장 아이디가 없습니다!');

    const invitation = await this.invitationRepository.findOneBy({ id });

    if (!invitation) throw new NotFoundException('청첩장 정보가 없습니다!');

    await this.invitationRepository.update(id, body);
    return await this.invitationRepository.findOne({
      where: { id },
      relations,
    });
  }

  // 청첩장 주인(결혼식 당사자) 수정
  async updateOwners(id: string, body: UpdateOwnersDto) {
    if (!id) throw new BadRequestException('청첩장 아이디가 없습니다!');

    const invitation = await this.invitationRepository.findOneBy({ id });

    if (!invitation) throw new NotFoundException('청첩장 정보가 없습니다!');

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

  // 청첩장 삭제
  async deleteInvitation(id: string) {
    await this.invitationRepository.delete(id);
    return true;
  }

  // 청첩장 메타 정보 수정
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

  // 청첩장 디자인 정보 수정
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

  // 청첩장 방문 횟수 수정
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

  // 청첩장 방문 횟수 조회
  async readVisitLogs(id: string) {
    return await this.visitsCountRepository.find({
      where: { invitation: { id } },
    });
  }

  // 청첩장 공유 가시성 생성
  async createShareVisibilty(id: string) {
    const invitation = await this.invitationRepository.findOneBy({ id });
    if (!invitation) throw new NotFoundException('청첩장 정보가 없습니다!');

    const share = {
      shareKey: transformDateString(invitation.eventAt.toISOString()),
      visible: true,
    };

    await this.invitationRepository.update(id, { ...invitation, share });
    return true;
  }

  // 청첩장 공유 가시성 끄기
  async offShareVisibilty(id: string) {
    const invitation = await this.invitationRepository.findOneBy({ id });
    if (!invitation) throw new NotFoundException('청첩장 정보가 없습니다!');

    await this.invitationRepository.update(id, { ...invitation, share: null });
    return true;
  }

  // 청첩장 복제하기
  async cloneInvitation(userId: string, id: string) {
    const invitation = await this.invitationRepository.findOneBy({ id });
    if (!invitation) throw new NotFoundException('청첩장 정보가 없습니다!');

    const newInvitation = await this.invitationRepository.create({
      ...invitation,
      user: { id: userId },
      owners: invitation.owners,
      widgets: invitation.widgets,
      meta: invitation.meta,
      design: invitation.design,
      createdAt: new Date(),
      updatedAt: new Date(),
      id: uuid(),
    });

    await this.invitationRepository.save(newInvitation);
    return newInvitation;
  }

  // 위젯 생성
  async createWidget(id: string, body: CreateWidgetDto) {
    const invitation = await this.invitationRepository.findOneBy({ id });
    if (!invitation) throw new NotFoundException('청첩장 정보가 없습니다!');

    const existingWidget = await this.widgetRepository.findOne({
      where: {
        invitation: { id: invitation.id },
        type: body.type,
      },
      relations: ['config'],
    });

    const widgetId = uuid();

    if (existingWidget) {
      if (existingWidget.type === 'INTRO') {
        throw new BadRequestException(
          'INTRO 위젯은 하나만 존재할 수 있습니다!',
        );
      } else {
        const existingConfig = await this.widgetConfigRepository.findOneBy({
          id: existingWidget.config.id,
        });

        // 기존 엔티티와 새로운 데이터를 병합
        const updatedConfig = this.widgetConfigRepository.merge(
          existingConfig,
          body.config,
        );
        await this.widgetConfigRepository.save(updatedConfig);

        // 기존 위젯 엔티티와 새로운 데이터를 병합
        const updatedWidget = this.widgetRepository.merge(existingWidget, body);
        updatedWidget.config = updatedConfig;
        await this.widgetRepository.save(updatedWidget);

        return this.widgetRepository.findOne({
          where: { id: updatedWidget.id },
          relations: ['config'],
        });
      }
    } else {
      const configId = uuid();
      const config = await this.widgetConfigRepository.create({
        ...body.config,
        id: configId,
      });
      await this.widgetConfigRepository.save(config);

      const widget = await this.widgetRepository.create({
        id: widgetId,
        config: {
          id: configId,
        },
        type: body.type,
        index: body.index,
        invitation: { id: invitation.id },
      });
      await this.widgetRepository.save(widget);
    }

    return this.widgetRepository.findOne({
      where: { id: widgetId },
      relations: ['config'],
    });
  }

  // 공유키로 청첩장 조회
  async readInvitationByShareKey(shareKey: string) {
    const queryResult = await this.invitationRepository
      .createQueryBuilder('invitation')
      .where("invitation.share ->> 'shareKey' = :shareKey", { shareKey }) // JSONB 필드 조건
      .getOne();

    const result = await this.invitationRepository.findOne({
      where: { id: queryResult.id },
      relations,
    });

    if (!result) throw new NotFoundException('청첩장 정보가 없습니다!');
    return result;
  }

  // 구매정보 불러오기
  async readOrder(id: string, query: ReadOrderDto) {
    // 일단 임시로 만들어 놓음
    const order = {
      orderId: uuid(),
      plan: query.orderType,
      orderName:
        query.orderType === 'THREE_MONTH_SHARE' ? '3개월(90일)' : '평생 소장',
      amount: 24900,
      originAmount: 50000,
      expiredAt:
        query.orderType === 'THREE_MONTH_SHARE'
          ? new Date(new Date().setMonth(new Date().getMonth() + 3))
          : null,
      couponCode: query.couponCode ?? null,
      isFreeOrder: false,
    };

    return order;
  }
}
