import { ApiProperty } from '@nestjs/swagger';
import { configExampleData } from 'src/invitation/data/invitation-example.data';
import { WidgetConfigModel } from '../entity/widget-config.entity';

export class UpdateWidgetConfigDto {
  @ApiProperty({
    description: '위젯 설정',
    example: configExampleData,
  })
  config: WidgetConfigModel;
}
