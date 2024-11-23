import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExcludeController,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { RequestWithUser } from 'src/common/type/common.type';
import { AuthService } from './auth.service';
import { ReqRes } from './decorator/req-res.decorator';
import { RegisterUserDto } from './dto/register-user.dto';
import { DynamicAuthGuard } from './guard/dynamic-auth.guard';

@Controller('oauth2')
@IsPublic()
//swagger에 노출하고 싶지 않음
@ApiExcludeController()
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
@IsPublic()
@ApiExcludeController()
export class LoginController {
  constructor(private readonly authService: AuthService) {}

  @Get('kakao')
  @UseGuards(DynamicAuthGuard)
  async kakaoCallback(
    @ReqRes() { req, res }: { req: RequestWithUser; res: Response },
  ) {
    const result = await this.authService.callback({ req });
    res.redirect(result.redirectTo);
  }

  @Get('google')
  @UseGuards(DynamicAuthGuard)
  async googleCallback(
    @ReqRes() { req, res }: { req: RequestWithUser; res: Response },
  ) {
    const result = await this.authService.callback({ req });
    res.redirect(result.redirectTo);
  }
}

@Controller('auth')
@IsPublic()
@ApiBearerAuth()
@ApiTags('유저')
export class RegisterController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: '회원가입',
    responses: {
      '200': {
        description: '회원가입 성공',
        content: {
          'application/json': {
            example: {
              id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            },
          },
        },
      },
    },
  })
  async register(@Body() body: RegisterUserDto) {
    return await this.authService.register(body);
  }
}
