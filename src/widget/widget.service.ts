import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateWidgetConfigDto } from './dto/update-widget-config.dto';
import { WidgetConfigModel } from './entity/widget-config.entity';
import { WidgetItemModel } from './entity/widget-item.entity';

@Injectable()
export class WidgetService {
  constructor(
    @InjectRepository(WidgetItemModel)
    private readonly widgetRepository: Repository<WidgetItemModel>,
    @InjectRepository(WidgetConfigModel)
    private readonly widgetConfigRepository: Repository<WidgetConfigModel>,
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
}
