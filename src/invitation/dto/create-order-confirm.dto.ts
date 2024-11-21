import { PickType } from '@nestjs/mapped-types';
import { OrderModel } from '../entity/order.entity';

export class CreateOrderConfirmDto extends PickType(OrderModel, [
  'paymentKey',
  'amount',
]) {}
