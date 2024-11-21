import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UpdateWidgetConfigDto } from './dto/update-widget-config.dto';
import { ColumnModel } from './entity/rsvp-column.entity';
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
  async readMyRsvpAnswer(invitationId: string) {
    const existingRows = await this.rowRepository.find({
      where: { invitation: { id: invitationId } },
      relations: ['rowValues', 'rowValues.column'],
    });

    if (!existingRows.length) {
      return {
        answered: false,
        data: null,
      };
    }

    return {
      answered: true,
      data: existingRows,
    };
  }

  // rsvp 응답 읽기(answers)
  async readRsvpTableDataAnswers(invitationId: string) {
    const columns = await this.columnRepository.find();
    const rows = await this.rowRepository.find({
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
}
