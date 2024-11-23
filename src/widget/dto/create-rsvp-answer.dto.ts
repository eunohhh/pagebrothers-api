import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { RowModel } from '../entity/rsvp-row.entity';

// pick type 에 추가로 formValues 추가

export class CreateRsvpAnswerDto extends PickType(RowModel, ['accepted']) {
  @IsNotEmpty()
  @IsString({ each: true })
  @ApiProperty({
    description: '응답 데이터',
    required: true,
  })
  formValues: {
    guestMeal: string;
    guestCount: number;
    guestPhone: number;
    guestName: string;
    whosGuest: string;
  };
}
