import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash } from 'crypto';
import { UpdateUserRoleDto } from 'src/admin/dto/update-user.dto';
import { ENV_JWT_SECRET_KEY } from 'src/common/const/env-keys.const';
import { RequestWithUser } from 'src/common/type/common.type';
import { UsersService } from 'src/users/users.service';
import { RowModel } from 'src/widget/entity/rsvp-row.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    @InjectRepository(RowModel)
    private readonly rowRepository: Repository<RowModel>,
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

  async createHash(invitationId: string) {
    const generatedUuid = uuid();

    const hash = createHash('sha256')
      .update(generatedUuid + invitationId)
      .digest('hex');

    const row = await this.rowRepository.create({
      invitation: {
        id: invitationId,
      },
      id: generatedUuid,
      sessionHash: hash,
    });

    const existingRow = await this.rowRepository.findOneBy({
      invitation: { id: invitationId },
      sessionHash: hash,
    });

    if (existingRow) {
      await this.rowRepository.delete(existingRow.id);
    }

    await this.rowRepository.save(row);

    return hash;
  }

  async validateCookie(
    invitationId: string,
    sessionId: string,
  ): Promise<boolean> {
    if (!sessionId) {
      throw new UnauthorizedException('Session cookie is missing');
    }
    const row = await this.rowRepository.findOne({
      where: {
        invitation: {
          id: invitationId,
        },
        sessionHash: sessionId,
      },
    });

    if (!row) {
      throw new UnauthorizedException('Invalid session cookie');
    }

    // 해싱 값과 비교
    // const expectedHash = createHash('sha256')
    //   .update(row.id + invitationId)
    //   .digest('hex');

    // if (sessionId !== expectedHash) {
    //   return false;
    // }

    if (sessionId !== row.sessionHash) {
      throw new UnauthorizedException('Invalid session cookie');
    }

    return true; // 검증 성공
  }

  async updateUserRole(dto: UpdateUserRoleDto) {
    return this.usersService.updateUserRole(dto);
  }
}
