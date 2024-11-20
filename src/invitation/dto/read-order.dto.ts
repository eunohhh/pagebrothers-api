import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { OrderType } from 'src/common/type/common.type';

export class ReadOrderDto {
  @IsString()
  @IsNotEmpty()
  orderType: OrderType;

  @IsOptional()
  @IsString()
  couponCode?: string;
}
