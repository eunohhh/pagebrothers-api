import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { OrderModel } from '../entity/order.entity';

export class CreateOrderConfirmDto extends PickType(OrderModel, [
  'paymentKey',
  'amount',
]) {
  @ApiProperty({ description: '결제키', example: 'string' })
  paymentKey: string;

  @ApiProperty({ description: '결제금액', example: 0 })
  amount: number;
}
