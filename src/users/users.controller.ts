import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReqRes } from 'src/auth/decorator/req-res.decorator';
import { RequestWithUser } from 'src/common/type/common.type';
import { UsersService } from './users.service';

@Controller('users')
@ApiBearerAuth()
@ApiTags('유저')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getUser(@ReqRes() { req }: { req: RequestWithUser }) {
    return this.usersService.getUserByEmail(req.user.email);
  }
}