import { Body, Controller, Delete, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateWidgetConfigDto } from './dto/update-widget-config.dto';
import { PositiveIntPipe } from './pipe/positive-int.pipe';
import { WidgetService } from './widget.service';

@Controller('widgets')
@ApiTags('청첩장/위젯')
@ApiBearerAuth()
export class WidgetController {
  constructor(private readonly widgetService: WidgetService) {}

  @Put(':id/config')
  @ApiOperation({ summary: '위젯 설정 수정' })
  async putWidgetConfig(
    @Param('id') id: string,
    @Body() body: { config: UpdateWidgetConfigDto },
  ) {
    return this.widgetService.updateWidgetConfig(id, body.config);
  }

  @Put(':id/index/:index')
  @ApiOperation({ summary: '위젯 위치 수정' })
  async putWidgetIndex(
    @Param('id') id: string,
    @Param('index', PositiveIntPipe) index: number,
  ) {
    return this.widgetService.updateWidgetIndex(id, index);
  }

  @Delete(':id')
  @ApiOperation({ summary: '위젯 삭제' })
  async deleteWidget(@Param('id') id: string) {
    return this.widgetService.deleteWidget(id);
  }
}
