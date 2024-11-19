import { PickType } from '@nestjs/swagger';
import { WidgetItemModel } from '../entity/widget-item.entity';

export class CreateWidgetDto extends PickType(WidgetItemModel, [
  'type',
  'config',
  'index',
]) {}
