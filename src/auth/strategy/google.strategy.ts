// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy, VerifyCallback } from 'passport-google-oauth20';

// @Injectable()
// export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
//   constructor(private readonly configService: ConfigService) {
//     const clientId = configService.get(ENV_GOOGLE_CLIENT_ID);
//     const clientSecret = configService.get(ENV_GOOGLE_CLIENT_SECRET);
//     const callbackUrl = configService.get(ENV_GOOGLE_CALLBACK_URL);

//     super({
//       clientID: clientId,
//       clientSecret: clientSecret,
//       callbackURL: callbackUrl,
//       scope: ['email', 'profile'],
//     });
//   }

//   async validate(
//     accessToken: string,
//     refreshToken: string,
//     profile: any,
//     done: VerifyCallback,
//   ): Promise<any> {
//     const { id, name, emails } = profile;
//     const user = {
//       provider: 'google',
//       id,
//       email: emails[0].value,
//       displayName: name.givenName + ' ' + name.familyName,
//     };
//     done(null, user);
//   }
// }
