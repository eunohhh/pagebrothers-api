import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ReqRes = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    return { req, res };
  },
);
