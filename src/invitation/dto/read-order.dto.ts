import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { OrderType } from './../../common/type/common.type';

export class ReadOrderDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '구매 타입',
  })
  orderType: OrderType;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '쿠폰코드',
    required: false,
  })
  couponCode?: string;
}
