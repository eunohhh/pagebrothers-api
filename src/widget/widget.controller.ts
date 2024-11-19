import { Controller } from '@nestjs/common';
import { WidgetService } from './widget.service';

@Controller('widget')
export class WidgetController {
  constructor(private readonly widgetService: WidgetService) {}
}
