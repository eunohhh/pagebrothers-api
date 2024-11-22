import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { CreateRsvpAnswerDto } from './dto/create-rsvp-answer.dto';
import { UpdateWidgetConfigDto } from './dto/update-widget-config.dto';
import { ColumnModel } from './entity/rsvp-column.entity';
import { RowValueModel } from './entity/rsvp-row-value.entity';
import { RowModel } from './entity/rsvp-row.entity';
import { WidgetConfigModel } from './entity/widget-config.entity';
import { WidgetItemModel } from './entity/widget-item.entity';

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
  ) {}

  // 위젯 설정 수정
  async updateWidgetConfig(id: string, body: UpdateWidgetConfigDto) {
    const existingConfig = await this.widgetConfigRepository.findOneBy({ id });
    const updatedConfig = this.widgetConfigRepository.merge(
      existingConfig,
      body,
    );
    await this.widgetConfigRepository.save(updatedConfig);

    return this.widgetRepository.findOne({
      where: { config: { id } },
      relations: ['config'],
    });
  }

  // 위젯 인덱스 수정
  async updateWidgetIndex(id: string, index: number) {
    if (index < 0) {
      throw new BadRequestException('인덱스는 음수일 수 없습니다!');
    }

    // 1. 대상 위젯 가져오기
    const targetWidget = await this.widgetRepository.findOne({
      where: { id },
    });
    if (!targetWidget) {
      throw new NotFoundException('위젯을 찾을 수 없습니다!');
    }
    // 인트로 위젯은 인덱스를 바꿀 수 없음
    if (targetWidget.type !== 'INTRO' && index === 0) {
      throw new BadRequestException(
        '인트로 위젯을 제외한 위젯의 인덱스는 0일 수 없습니다!',
      );
    }

    await this.dataSource.transaction(async (manager) => {
      const widgetRepository = manager.getRepository(WidgetItemModel);

      // 2. 충돌하는 위젯의 인덱스를 한 번에 증가
      await manager
        .createQueryBuilder()
        .update(WidgetItemModel)
        .set({ index: () => `"index" + 1` }) // SQL에서 "index" 값을 +1
        .where('index >= :newIndex', { newIndex: index })
        .execute();

      // 3. 대상 위젯의 인덱스를 업데이트
      targetWidget.index = index;
      await widgetRepository.save(targetWidget);
    });

    return this.widgetRepository.findOne({
      where: { id },
      relations: ['config'],
    });
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
    const count = await this.rowRepository.count({
      where: { invitation: { id: invitationId } },
    });
    return count;
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
