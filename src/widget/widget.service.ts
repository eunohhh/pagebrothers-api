import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { InvitationModel } from 'src/invitation/entity/invitation.entity';
import { DataSource, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { basicRsvpExtraFields } from './data/basic-rsvp.data';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateRsvpAnswerDto } from './dto/create-rsvp-answer.dto';
import { CreateWidgetDto } from './dto/create-widget.dto';
import { UpdateWidgetConfigDto } from './dto/update-widget-config.dto';
import { CommentModel } from './entity/comment.entity';
import { ColumnModel } from './entity/rsvp-column.entity';
import { RowValueModel } from './entity/rsvp-row-value.entity';
import { RowModel } from './entity/rsvp-row.entity';
import { WidgetConfigModel } from './entity/widget-config.entity';
import { WidgetItemModel } from './entity/widget-item.entity';

// 위젯 타입 제약 목록
const SINGLE_INSTANCE_WIDGETS = [
  'INTRO',
  'RSVP',
  'CALENDAR',
  'LOCATION',
  'GUESTBOOK',
  'SHARE',
  'EVENT_SEQUENCE',
  'GREETING',
  'CONGRATULATION',
];

@Injectable()
export class WidgetService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(WidgetItemModel)
    private readonly widgetRepository: Repository<WidgetItemModel>,
    @InjectRepository(WidgetConfigModel)
    private readonly widgetConfigRepository: Repository<WidgetConfigModel>,
    @InjectRepository(ColumnModel)
    private readonly columnRepository: Repository<ColumnModel>,
    @InjectRepository(RowModel)
    private readonly rowRepository: Repository<RowModel>,
    @InjectRepository(RowValueModel)
    private readonly rowValueRepository: Repository<RowValueModel>,
    @InjectRepository(CommentModel)
    private readonly commentRepository: Repository<CommentModel>,
    @InjectRepository(InvitationModel)
    private readonly invitationRepository: Repository<InvitationModel>,
    private readonly commonService: CommonService,
  ) {}

  // 위젯 설정 수정
  async updateWidgetConfig(widgetId: string, body: UpdateWidgetConfigDto) {
    const existingWidget = await this.widgetRepository.findOne({
      where: { id: widgetId },
      relations: ['config'],
    });

    const updatedConfig = this.widgetConfigRepository.merge(
      existingWidget.config,
      body.config,
    );
    await this.widgetConfigRepository.save(updatedConfig);

    const result = await this.widgetRepository.findOne({
      where: { id: widgetId },
      relations: ['config', 'invitation'],
    });

    await this.commonService.addInvitationEditor(
      result.invitation.id,
      result.invitation.user.id,
    );

    return result;
  }

  // 위젯 인덱스 수정
  async updateWidgetIndex(id: string, newIndex: number) {
    if (newIndex < 0) {
      throw new BadRequestException('인덱스는 음수일 수 없습니다!');
    }

    // 대상 위젯 가져오기
    const targetWidget = await this.widgetRepository.findOne({
      where: { id },
      relations: ['invitation'],
    });
    if (!targetWidget) {
      throw new NotFoundException('위젯을 찾을 수 없습니다!');
    }

    const currentIndex = targetWidget.index;

    // 인트로 위젯에 대한 예외 처리
    if (targetWidget.type === 'INTRO') {
      throw new BadRequestException(
        '인트로 위젯의 인덱스는 변경할 수 없습니다!',
      );
    }
    if (newIndex === 0) {
      throw new BadRequestException(
        '인트로 위젯을 제외한 위젯의 인덱스는 0일 수 없습니다!',
      );
    }

    await this.dataSource.transaction(async (manager) => {
      const widgetRepository = manager.getRepository(WidgetItemModel);

      // 동일한 invitation의 위젯만 대상으로 함
      const invitationId = targetWidget.invitation.id;

      // 1. 대상 위젯의 인덱스를 임시 값으로 설정하여 인덱스 중복 방지
      targetWidget.index = -1;
      await widgetRepository.save(targetWidget);

      if (newIndex < currentIndex) {
        // 인덱스 감소: 기존 인덱스와 새 인덱스 사이의 위젯을 +1
        await manager
          .createQueryBuilder()
          .update(WidgetItemModel)
          .set({ index: () => `"index" + 1` })
          .where('invitationId = :invitationId', { invitationId })
          .andWhere('index >= :newIndex AND index < :currentIndex', {
            newIndex,
            currentIndex,
          })
          .execute();
      } else if (newIndex > currentIndex) {
        // 인덱스 증가: 기존 인덱스와 새 인덱스 사이의 위젯을 -1
        await manager
          .createQueryBuilder()
          .update(WidgetItemModel)
          .set({ index: () => `"index" - 1` })
          .where('invitationId = :invitationId', { invitationId })
          .andWhere('index > :currentIndex AND index <= :newIndex', {
            currentIndex,
            newIndex,
          })
          .execute();
      }

      // 3. 대상 위젯의 인덱스를 새로운 값으로 설정
      targetWidget.index = newIndex;
      await widgetRepository.save(targetWidget);
    });

    const result = await this.widgetRepository.findOne({
      where: { id },
      relations: ['config', 'invitation', 'invitation.user'],
    });

    await this.commonService.addInvitationEditor(
      result.invitation.id,
      result.invitation.user.id,
    );

    return result;
  }

  // 위젯 삭제
  async deleteWidget(id: string) {
    const targetWidget = await this.widgetRepository.findOneBy({ id });
    if (!targetWidget) {
      throw new NotFoundException('위젯을 찾을 수 없습니다!');
    }

    await this.widgetRepository.delete(id);

    return targetWidget;
  }

  // 나의 RSVP 응답 조희
  async readMyRsvpAnswer(invitationId: string, sessionId: string) {
    const existingRowValues = await this.rowValueRepository.find({
      where: {
        row: { invitation: { id: invitationId }, sessionHash: sessionId },
      },
      relations: ['column'],
    });

    if (!existingRowValues.length) {
      return {
        answered: false,
        data: null,
      };
    }

    return {
      answered: true,
      data: existingRowValues,
    };
  }

  // 나의 RSVP 응답 제출(answer)
  async createMyRsvpAnswer(
    invitationId: string,
    sessionId: string,
    body: CreateRsvpAnswerDto,
  ) {
    // column에서 모든 값가져오기
    const columns = await this.columnRepository.find();
    // 어느쪽 손님인지 확인하는 문항의 id 인데,
    // '' (문항 타이틀) 값은 기본값이고, 변경될 수 있기 때문에 추후 로직 수정 요망
    const whosGuestUuid = columns.find((col) => col.title === '')?.id;
    const guestCountUuid = columns.find(
      (col) => col.title === '참석 인원 (본인 포함)',
    )?.id;
    const guestPhoneUuid = columns.find(
      (col) => col.title === '연락처 뒷자리',
    )?.id;
    const guestMealUuid = columns.find((col) => col.title === '식사 여부')?.id;
    const guestNameUuid = columns.find(
      (col) => col.title === '참석자 이름',
    )?.id;

    const existingRow = await this.rowRepository.findOne({
      where: {
        invitation: { id: invitationId },
        sessionHash: sessionId,
      },
    });

    if (existingRow) {
      await this.rowRepository.delete(existingRow.id);
    }

    // 부모(RowModel) 저장
    const row = this.rowRepository.create({
      invitation: { id: invitationId },
      sessionHash: sessionId,
      accepted: body.accepted,
      rowValues: [],
    });

    await this.rowRepository.save(row);

    const rowValues = [
      {
        id: 'accepted',
        column: { id: 'accepted' },
        value: body.accepted ? 'true' : 'false',
        row: row,
      },
      {
        id: whosGuestUuid,
        column: { id: whosGuestUuid },
        value: String(body.formValues.whosGuest),
        row: row,
      },
      {
        id: guestNameUuid,
        column: { id: guestNameUuid },
        value: String(body.formValues.guestName),
        row: row,
      },
      {
        id: guestPhoneUuid,
        column: { id: guestPhoneUuid },
        value: String(body.formValues.guestPhone),
        row: row,
      },
      {
        id: guestCountUuid,
        column: { id: guestCountUuid },
        value: String(body.formValues.guestCount),
        row: row,
      },
      {
        id: guestMealUuid,
        column: { id: guestMealUuid },
        value: String(body.formValues.guestMeal),
        row: row,
      },
    ].map((rowValue) => this.rowValueRepository.create(rowValue)); // 개별 RowValue 생성;

    // return rowValues;

    await this.rowValueRepository.save(rowValues);

    // 저장된 데이터 반환
    const savedRow = await this.rowRepository.findOne({
      where: {
        invitation: { id: invitationId },
        sessionHash: sessionId,
      },
      relations: ['rowValues', 'rowValues.column'],
    });

    return savedRow;
  }

  // rsvp 응답들 읽기(answers)
  async readRsvpTableDataAnswers(invitationId: string) {
    const columns = await this.columnRepository.find();
    const rows = await this.rowRepository.find({
      where: { invitation: { id: invitationId } },
      relations: ['rowValues', 'rowValues.column'],
    });

    return {
      columns: columns.map((col) => ({ id: col.id, title: col.title })),
      rows: rows.map((row) => ({
        id: row.id,
        no: row.no,
        accepted: row.accepted,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        updated: row.updated,
        ...row.rowValues.reduce((acc, value) => {
          acc[value.column.id] = value.value;
          return acc;
        }, {}),
      })),
    };
  }

  // rsvp 응답 개수 조회
  async readRsvpAnswerCount(invitationId: string) {
    const acceptedCount = await this.rowRepository.count({
      where: { invitation: { id: invitationId }, accepted: true },
    });
    const rejectedCount = await this.rowRepository.count({
      where: { invitation: { id: invitationId }, accepted: false },
    });
    return { acceptedCount, rejectedCount };
  }

  // 방명록 게시글 조회
  async readCommentList(invitationId: string, page: number, size: number) {
    const [content, totalElements] = await this.commentRepository.findAndCount({
      where: { invitation: { id: invitationId } },
      take: size,
      skip: page * size,
      order: { createdAt: 'DESC' },
    });

    return {
      content,
      pageable: {
        sort: {
          empty: false,
          sorted: true,
          unsorted: false,
        },
        offset: page * size,
        pageNumber: page,
        pageSize: size,
        paged: true,
        unpaged: false,
      },
      totalPages: Math.ceil(totalElements / size),
      totalElements,
      last: page >= Math.ceil(totalElements / size) - 1,
      size,
      number: page,
      sort: {
        empty: false,
        sorted: true,
        unsorted: false,
      },
      numberOfElements: content.length,
      first: page === 0,
      empty: content.length === 0,
    };
  }

  // 방명록 게시글 작성
  async createComment(
    invitationId: string,
    body: CreateCommentDto | Partial<CreateCommentDto>,
    isFirstComment: boolean = false,
  ) {
    const invitation = await this.invitationRepository.findOneBy({
      id: invitationId,
    });
    if (!invitation) {
      throw new NotFoundException('초대장을 찾을 수 없습니다!');
    }

    if (isFirstComment) {
      const comment = this.commentRepository.create({
        invitation: { id: invitationId },
        id: uuid(),
        author: '페이지시스터즈팀',
        authorProfileImage: '\uD83D\uDC30',
        body: '두 분의 결혼을 진심으로 축하드립니다 \uD83D\uDE0A\n행복하고 좋은 일만 가득하시길 바랄게요! ',
        children: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        password: '1234',
      });
      await this.commentRepository.save(comment);
      return {
        id: comment.id,
      };
    }

    const comment = this.commentRepository.create({
      invitation: { id: invitationId },
      ...body,
    });
    await this.commentRepository.save(comment);

    return {
      id: comment.id,
    };
  }

  // 방명록 게시글 삭제
  async deleteComment(commentId: string, password: string) {
    const comment = await this.commentRepository.findOneBy({ id: commentId });
    if (!comment) {
      throw new NotFoundException('방명록 게시글을 찾을 수 없습니다!');
    }
    if (comment.password !== password) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다!');
    }

    await this.commentRepository.delete(comment.id);

    return true;
  }

  // 방명록 게시글 수정
  async updateComment(
    commentId: string,
    body: Pick<CreateCommentDto, 'body' | 'password'>,
  ) {
    const comment = await this.commentRepository.findOneBy({ id: commentId });
    if (!comment) {
      throw new NotFoundException('방명록 게시글을 찾을 수 없습니다!');
    }
    if (comment.password !== body.password) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다!');
    }

    await this.commentRepository.update(comment.id, {
      body: body.body,
    });

    return true;
  }

  // 위젯 생성(invitation service에서 사용)
  async createWidget(invitation: InvitationModel, body: CreateWidgetDto) {
    const existingWidgets = await this.widgetRepository.find({
      where: { invitation: { id: invitation.id }, type: body.type },
      relations: ['config'],
    });

    // 1. 기존 위젯 검색
    const existingWidget = existingWidgets.find(
      (widget) => widget.index === body.index,
    );

    // 2. 기존 위젯 처리
    if (existingWidget) {
      if (SINGLE_INSTANCE_WIDGETS.includes(existingWidget.type)) {
        throw new BadRequestException(
          `${existingWidget.type} 위젯은 하나만 존재할 수 있습니다!`,
        );
      }

      return this.updateExistingWidget(existingWidget, body);
    }

    // 3. 인덱스 재정렬
    await this.reorderWidgetIndexes(invitation.id, body.index);

    // 4. 새 위젯 생성
    const widgetId = uuid();
    await this.createNewWidget(invitation, widgetId, body);
    if (body.type === 'GUESTBOOK')
      await this.createComment(invitation.id, {}, true);

    // 5. 초대장 편집자 추가
    await this.commonService.addInvitationEditor(
      invitation.id,
      invitation.user.id,
    );

    // 6. 결과 반환
    return this.widgetRepository.findOne({
      where: { id: widgetId },
      relations: ['config'],
    });
  }

  // 기존 위젯 업데이트
  private async updateExistingWidget(existingWidget, body: CreateWidgetDto) {
    // 위젯 설정 병합 및 저장
    const updatedConfig = this.widgetConfigRepository.merge(
      existingWidget.config,
      body.config,
    );
    await this.widgetConfigRepository.save(updatedConfig);

    // 위젯 병합 및 저장
    const updatedWidget = this.widgetRepository.merge(existingWidget, body);
    updatedWidget.config = updatedConfig;
    await this.widgetRepository.save(updatedWidget);

    return this.widgetRepository.findOne({
      where: { id: updatedWidget.id },
      relations: ['config'],
    });
  }

  // 인덱스 재정렬
  private async reorderWidgetIndexes(invitationId: string, newIndex: number) {
    await this.widgetRepository
      .createQueryBuilder()
      .update()
      .set({ index: () => '"index" + 1' }) // SQL 표현식으로 인덱스 증가
      .where('"invitationId" = :invitationId', { invitationId }) // 해당 초대장에 속하는 위젯만
      .andWhere('"index" >= :newIndex', { newIndex }) // 대상 인덱스 이상인 것만
      .execute();
  }

  // 새 위젯 생성
  private async createNewWidget(
    invitation: InvitationModel,
    widgetId: string,
    body: CreateWidgetDto,
  ) {
    const existingColumns = await this.columnRepository.find();

    const configId = uuid();
    let config;
    // rsvp 일 경우 추가적인 로직 작성 필요
    if (body.type === 'RSVP') {
      config = await this.widgetConfigRepository.create({
        ...body.config,
        id: configId,
        extraFields:
          body.config.extraFields?.length > 0
            ? body.config.extraFields.map((field) => ({
                ...field,
                id: existingColumns.find(
                  (column) => column.title === field.label,
                )?.id,
              }))
            : basicRsvpExtraFields.map((field) => ({
                ...field,
                id: existingColumns.find(
                  (column) => column.title === field.label,
                )?.id,
              })),
      });
    } else if (body.type === 'GREETING') {
      // invitation.owners의 ID를 Set으로 변환
      const ownerIds = new Set(invitation.owners.map((owner) => owner.id));
      const invalidHosts = Object.keys(body.config.hosts).filter(
        (hostId) => !ownerIds.has(hostId), // ownerIds에 없는 hostId 찾기
      );

      if (invalidHosts.length > 0) {
        throw new BadRequestException(
          `잘못된 혼주 정보입니다: ${invalidHosts.join(', ')}`,
        );
      }

      config = await this.widgetConfigRepository.create({
        ...body.config,
        id: configId,
      });
    } else {
      config = await this.widgetConfigRepository.create({
        ...body.config,
        id: configId,
      });
    }

    await this.widgetConfigRepository.save(config);

    const widget = this.widgetRepository.create({
      id: widgetId,
      config: { id: configId },
      type: body.type,
      index: body.index,
      invitation: { id: invitation.id },
    });

    return this.widgetRepository.save(widget);
  }
}

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(
    @InjectRepository(ColumnModel)
    private readonly columnRepository: Repository<ColumnModel>,
  ) {}

  async onModuleInit() {
    await this.initializeColumns();
  }

  private async initializeColumns() {
    const existingColumns = await this.columnRepository.find();
    if (existingColumns.length > 0) {
      console.log('Columns already initialized.');
      return;
    }

    const whosGuestUuid = uuid();
    const guestCountUuid = uuid();
    const guestPhoneUuid = uuid();
    const guestMealUuid = uuid();
    const guestNameUuid = uuid();

    const columns = this.columnRepository.create([
      { id: 'accepted', title: '참석여부' },
      { id: whosGuestUuid, title: '' },
      { id: guestNameUuid, title: '참석자 이름' },
      { id: guestPhoneUuid, title: '연락처 뒷자리' },
      { id: guestCountUuid, title: '참석 인원 (본인 포함)' },
      { id: guestMealUuid, title: '식사 여부' },
    ]);

    await this.columnRepository.save(columns);
    console.log('Default columns initialized.');
  }
}
