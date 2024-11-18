import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvitationModel } from './entity/invitation.entity';

@Injectable()
export class InvitationService {
  constructor(
    @InjectRepository(InvitationModel)
    private readonly invitationRepository: Repository<InvitationModel>,
  ) {}

  async readInvitations(id: string) {
    if (!id) throw new BadRequestException('유저 아이디가 없습니다!');

    const result = await this.invitationRepository.find({
      where: { user: { id } },
    });

    const items = {
      items: result,
    };

    return items;
  }
}
