import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ENV_JWT_SECRET_KEY } from 'src/common/const/env-keys.const';
import { RequestWithUser } from 'src/common/type/common.type';
import { UsersService } from 'src/users/users.service';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  generateJwt(user: any): string {
    const payload = {
      sub: user.providerId,
      email: user.email,
      profile: user.thumbnail_image,
    };
    return this.jwtService.sign(payload, {
      secret: this.configService.get(ENV_JWT_SECRET_KEY),
      expiresIn: '3h',
    });
  }

  async callback({ req }: { req: RequestWithUser }) {
    const user = req.user;
    // 회원 여부 확인
    const isRegistered = await this.usersService.getUserByEmail(user.email);
    const token = this.generateJwt(user);

    const registerUri = `${user.register_uri}?name=${user.name}&profileImage=${user.profileImage}&providerId=${user.providerId}&email=${user.email}&provider=${user.provider}`;
    // 클라이언트로 리다이렉트
    const redirectTo = isRegistered
      ? `${user.clientProtocol}://${user.clientHost}/login/callback?token=${token}&backUrl=${user.redirect_uri}`
      : `${user.clientProtocol}://${user.clientHost}/login/callback?token=${token}&backUrl=${registerUri}`;

    return { token, redirectTo };
  }

  extractTokenFromHeader(header: string) {
    const splitToken = header.split(' ');

    if (splitToken.length !== 2 || splitToken[0] !== 'Bearer')
      throw new UnauthorizedException('잘못된 토큰입니다');

    const token = splitToken[1];
    return token;
  }

  // 토큰 검증
  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get(ENV_JWT_SECRET_KEY),
      });
    } catch {
      throw new UnauthorizedException('토큰이 만료되었거나 잘못된 토큰입니다.');
    }
  }

  async register(body: RegisterUserDto) {
    return await this.usersService.createUser(body);
  }
}
