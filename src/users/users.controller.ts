import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReqRes } from 'src/auth/decorator/req-res.decorator';
import { RequestWithUser } from 'src/common/type/common.type';
import { UsersService } from './users.service';

@Controller('user')
@ApiBearerAuth()
@ApiTags('유저')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({
    summary: '나의 정보 불러오기',
    responses: {
      '200': {
        description: '나의 정보 불러오기 성공',
        content: {
          'application/json': {
            example: {
              id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
              name: '하헌준',
              email: 'pagesisters.cc@gmail.com',
              profileImage: 'string',
              provider: 'KAKAO',
            },
          },
        },
      },
    },
  })
  getUser(@ReqRes() { req }: { req: RequestWithUser }) {
    return this.usersService.getUserByEmail(req.user.email);
  }
}
