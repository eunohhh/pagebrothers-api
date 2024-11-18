import { Controller, Get, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { RequestWithUser } from 'src/common/type/common.type';
import { AuthService } from './auth.service';
import { ReqRes } from './decorator/req-res.decorator';
import { DynamicAuthGuard } from './guard/dynamic-auth.guard';

@Controller('oauth2')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 동적 경로 처리 (Kakao/Google 지원)
  @Get('authorize/:provider')
  @UseGuards(DynamicAuthGuard)
  async authorize() {
    console.log('redirecting...');
  }
}

@Controller('login/callback')
export class LoginController {
  constructor(private readonly authService: AuthService) {}

  @Get('kakao')
  @UseGuards(DynamicAuthGuard)
  async kakaoCallback(
    @ReqRes() { req, res }: { req: RequestWithUser; res: Response },
  ) {
    return this.authService.callback({ req, res });
  }

  @Get('google')
  @UseGuards(DynamicAuthGuard)
  async googleCallback(
    @ReqRes() { req, res }: { req: RequestWithUser; res: Response },
  ) {
    return this.authService.callback({ req, res });
  }
}
