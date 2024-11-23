import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import {
  ENV_GOOGLE_CALLBACK_URL,
  ENV_GOOGLE_CLIENT_ID,
  ENV_GOOGLE_CLIENT_SECRET,
} from 'src/common/const/env-keys.const';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    const clientId = configService.get(ENV_GOOGLE_CLIENT_ID);
    const clientSecret = configService.get(ENV_GOOGLE_CLIENT_SECRET);
    const callbackUrl = configService.get(ENV_GOOGLE_CALLBACK_URL);

    super({
      clientID: clientId,
      clientSecret: clientSecret,
      callbackURL: callbackUrl,
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const state = req.query.state
      ? JSON.parse(decodeURIComponent(req.query.state))
      : {};

    const clientProtocol = state.protocol;
    const clientHost = state.host;
    const redirectUri = state.redirect_uri;
    const registerUri = state.register_uri;

    const { id, name, emails } = profile;
    const { picture } = profile._json;

    const user = {
      provider: 'GOOGLE',
      providerId: id,
      email: emails[0].value,
      name: name.givenName + ' ' + name.familyName,
      profileImage: picture,
      clientProtocol,
      clientHost,
      redirect_uri: redirectUri,
      register_uri: registerUri,
    };
    return user;
  }
}
