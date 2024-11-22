import { ApiProperty, PickType } from '@nestjs/swagger';
import { WidgetType } from 'src/common/type/common.type';
import { configExampleData } from 'src/invitation/data/invitation-example.data';
import { WidgetConfigModel } from '../entity/widget-config.entity';
import { WidgetItemModel } from '../entity/widget-item.entity';

export class CreateWidgetDto extends PickType(WidgetItemModel, [
  'type',
  'config',
  'index',
]) {
  @ApiProperty({
    description: '위젯 타입',
  })
  type: WidgetType;

  @ApiProperty({
    description: '위젯 인덱스',
  })
  index: number;

  @ApiProperty({
    description: '위젯 설정',
    example: configExampleData,
  })
  config: WidgetConfigModel;
}
