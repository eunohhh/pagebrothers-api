import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvitationService } from 'src/invitation/invitation.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateTemplateDto } from './dto/create-template.dto';
import { ReadTemplatesQueryDto } from './dto/read-template.dto';
import { UpdateTemplateOrderDto } from './dto/update-template-order.dto';
import { UpdateTemplateStageDto } from './dto/update-template-stage.dto';
import { UpdateTemplateTitleDto } from './dto/update-template-title.dto';
import { TemplateModel } from './entity/template.entity';

@Injectable()
export class AdminService {
  constructor(
    private readonly invitationService: InvitationService,
    @InjectRepository(TemplateModel)
    private readonly templateRepository: Repository<TemplateModel>,
    private readonly userService: UsersService,
  ) {}

  // 모든 템플릿 조회
  async readAllTemplates() {
    const templates = await this.templateRepository.find();

    return templates;
  }

  // 템플릿 조회
  async readTemplates(query: ReadTemplatesQueryDto) {
    const templates = await this.templateRepository.find({
      where: {
        stage: query.stage,
      },
      order: {
        number: 'ASC',
      },
    });

    if (!templates) throw new NotFoundException('템플릿 정보가 없습니다!');

    return templates;
  }

  // 템플릿 생성
  async createTemplate(dto: CreateTemplateDto) {
    const invitation = await this.invitationService.readInvitation(
      dto.invitationId,
    );

    if (!invitation) throw new NotFoundException('청첩장 정보가 없습니다!');

    const template = Object.assign(new TemplateModel(), invitation);
    template.stage = dto.stage;

    const templates = await this.templateRepository.find({
      where: {
        stage: dto.stage,
      },
    });
    template.number = templates.length;

    const newTemplate = this.templateRepository.create(template);
    await this.templateRepository.save(newTemplate);

    return template;
  }

  // 템플릿 등급 수정
  async updateTemplateStage(id: string, dto: UpdateTemplateStageDto) {
    const template = await this.templateRepository.findOne({
      where: { id },
    });

    if (!template) throw new NotFoundException('템플릿 정보가 없습니다!');

    template.stage = dto.stage;

    await this.templateRepository.save(template);

    return template;
  }

  // 템플릿 타이틀 수정
  async updateTemplateTitle(id: string, dto: UpdateTemplateTitleDto) {
    const template = await this.templateRepository.findOne({
      where: { id },
    });

    if (!template) throw new NotFoundException('템플릿 정보가 없습니다!');

    template.title = dto.title;

    await this.templateRepository.save(template);

    return template;
  }

  // 템플릿 삭제
  async deleteTemplate(id: string) {
    const template = await this.templateRepository.findOne({
      where: { id },
    });

    if (!template) throw new NotFoundException('템플릿 정보가 없습니다!');

    await this.templateRepository.delete(id);

    return true;
  }

  // 모든 청첩장 조회
  async readAllInvitations() {
    const invitations = await this.invitationService.readAllInvitations();

    return invitations;
  }

  // 청첩장 조회
  async readInvitation(id: string) {
    const invitation = await this.invitationService.readInvitation(id);

    if (!invitation) throw new NotFoundException('청첩장 정보가 없습니다!');

    return invitation;
  }

  // 유저 검색 쿼리 기반
  async searchUsers(query: string) {
    const users = await this.userService.searchUsers(query);

    if (!users) throw new NotFoundException('유저 정보가 없습니다!');

    return users;
  }

  // 현재 어드민 유저 정보 가져오기
  async getCurrentAdminUser(email: string) {
    return this.userService.getCurrentAdminUser(email);
  }

  // 전체 사이트 상태들 가져오기
  async getSiteStatus() {
    const count = await this.invitationService.getTotalInvitationCount();
    const userCount = await this.userService.getTotalUserCount();
    const sharedCount =
      await this.invitationService.getTotalSharedInvitationCount();
    const sharedAndVisibleCount =
      await this.invitationService.getTotalSharedAndVisibleInvitationCount();
    const sharedThisMonthCount =
      await this.invitationService.getTotalSharedInvitationCountThisMonth(true);
    const sharedThisMonthNotVisibleCount =
      await this.invitationService.getTotalSharedInvitationCountThisMonth(
        false,
      );

    return {
      totalInvitationCount: count,
      totalUserCount: userCount,
      totalSharedCount: sharedCount,
      currentSharingCount: sharedAndVisibleCount,
      sharedCountInThisMonth: sharedThisMonthCount,
      invitationCountInThisMonth: sharedThisMonthNotVisibleCount,
    };
  }

  // admin에서 청첩장 복사
  async copyInvitation(id: string) {
    return this.invitationService.cloneInvitationByAdmin(id);
  }

  // 템플릿 순서 수정
  async updateTemplateOrder(dto: UpdateTemplateOrderDto) {
    const templates = await this.templateRepository.find({
      where: {
        stage: dto.stage,
      },
    });

    if (!templates || templates.length === 0) {
      throw new NotFoundException('템플릿 정보가 없습니다!');
    }

    // templates 배열을 dto.pairs의 순서대로 정렬
    const updatedTemplates = dto.pairs.map((pair) => {
      const foundTemplate = templates.find(
        (template) => template.id === pair.id,
      );
      if (!foundTemplate) {
        throw new NotFoundException(`템플릿 ID ${pair.id}를 찾을 수 없습니다.`);
      }

      // 정렬된 순서를 데이터베이스에 반영할 수 있도록 업데이트
      foundTemplate.number = pair.order;
      return foundTemplate;
    });

    await this.templateRepository.save(updatedTemplates);

    return updatedTemplates;
  }
}
