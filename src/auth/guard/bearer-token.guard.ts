import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/common/decorator/is-public.decorator';
import { UsersService } from 'src/users/users.service';
import { AuthService } from '../auth.service';

@Injectable()
export class BearerTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const req = context.switchToHttp().getRequest();

    if (isPublic) {
      req.isRoutePublic = true;

      return true;
    }

    const rawToken = req.headers['authorization'];

    if (!rawToken) throw new UnauthorizedException('토큰이 없습니다!');

    const token = this.authService.extractTokenFromHeader(rawToken);
    const result = await this.authService.verifyToken(token);
    const user = await this.usersService.getUserByEmail(result.email);

    if (!user) throw new UnauthorizedException('유저 정보가 없습니다!');

    req.user = user;
    req.token = token;

    return true;
  }
}
