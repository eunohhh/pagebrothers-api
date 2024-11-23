import { WidgetConfigModel } from 'src/widget/entity/widget-config.entity';

export const removeNullProperty = (obj: WidgetConfigModel) => {
  const result = Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== null),
  );
  delete result.id;
  return result;
};
