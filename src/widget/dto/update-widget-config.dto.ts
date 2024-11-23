import { ApiProperty } from '@nestjs/swagger';
import { WidgetType } from 'src/common/type/common.type';
import { configExampleData } from 'src/invitation/data/invitation-example.data';
import { WidgetConfigModel } from '../entity/widget-config.entity';

export class UpdateWidgetConfigDto {
  @ApiProperty({
    description: '위젯 설정',
    example: configExampleData,
  })
  config: WidgetConfigModel;

  @ApiProperty({
    description: '위젯 인덱스',
    example: 0,
  })
  index: number;

  @ApiProperty({
    description: '위젯 타입',
    example: 'INTRO',
  })
  type: WidgetType;

  @ApiProperty({
    description: '위젯 아이디',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;
}
