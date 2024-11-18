import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import {
  AuthController,
  LoginController,
  RegisterController,
} from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategy/google.strategy';
import { KakaoStrategy } from './strategy/kakao.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'kakao' }),
    JwtModule.register({}),
    UsersModule,
  ],
  controllers: [AuthController, LoginController, RegisterController],
  providers: [AuthService, KakaoStrategy, GoogleStrategy],
  exports: [AuthService],
})
export class AuthModule {}
