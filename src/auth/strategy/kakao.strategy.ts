import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-kakao';
import {
  ENV_KAKAO_CLIENT_SECRET,
  ENV_KAKAO_REDIRECT_URI,
  ENV_KAKAO_REST_API_KEY,
} from 'src/common/const/env-keys.const';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private readonly configService: ConfigService) {
    // super 호출 전에 필요한 값을 변수로 준비
    const clientID = configService.get<string>(ENV_KAKAO_REST_API_KEY);
    const clientSecret = configService.get<string>(ENV_KAKAO_CLIENT_SECRET);
    const callbackURL = configService.get<string>(ENV_KAKAO_REDIRECT_URI);

    // 준비된 값을 super로 전달
    super({
      clientID,
      clientSecret,
      callbackURL,
      passReqToCallback: true,
    });
  }

  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ) {
    const state = req.query.state
      ? JSON.parse(decodeURIComponent(req.query.state))
      : {};

    // const clientProtocol = req.protocol;
    // const clientHost = req.get('host');
    const clientProtocol = state.protocol;
    const clientHost = state.host;
    const redirectUri = state.redirect_uri;
    const registerUri = state.register_uri;

    // Kakao 사용자 정보를 반환
    const { id, username, _json } = profile;
    const { thumbnail_image } = _json.properties;
    const { email } = _json.kakao_account;

    return {
      provider: 'kakao',
      providerId: id,
      username,
      email,
      thumbnail_image,
      clientProtocol,
      clientHost,
      redirect_uri: redirectUri,
      register_uri: registerUri,
    };
  }
}
