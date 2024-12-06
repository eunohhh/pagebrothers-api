import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvitationService } from 'src/invitation/invitation.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateTemplateDto } from './dto/create-template.dto';
import { ReadTemplatesQueryDto } from './dto/read-template.dto';
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

  // 템플릿 조회
  async readTemplates(query: ReadTemplatesQueryDto) {
    const templates = await this.templateRepository.find({
      where: {
        stage: query.stage,
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
}
