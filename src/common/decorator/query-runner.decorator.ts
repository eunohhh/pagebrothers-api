import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const QueryRunner = createParamDecorator(
  (data, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const qr = req.queryRunner;

    if (!qr) {
      return new InternalServerErrorException(
        '쿼리러너를 사용하려면 transaction decorator를 사용하세요',
      );
    }

    return qr;
  },
);
