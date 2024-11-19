import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class PositiveIntPipe implements PipeTransform {
  transform(value: string): number {
    const val = parseInt(value, 10);
    if (isNaN(val) || val < 0) {
      throw new BadRequestException('Index must be a positive integer');
    }
    return val;
  }
}
