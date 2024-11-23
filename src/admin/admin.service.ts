import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvitationService } from 'src/invitation/invitation.service';
import { Repository } from 'typeorm';
import { CreateTemplateDto } from './dto/create-template.dto';
import { ReadTemplatesQueryDto } from './dto/read-template.dto';
import { TemplateModel } from './entity/template.entity';

@Injectable()
export class AdminService {
  constructor(
    private readonly invitationService: InvitationService,
    @InjectRepository(TemplateModel)
    private readonly templateRepository: Repository<TemplateModel>,
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
}
