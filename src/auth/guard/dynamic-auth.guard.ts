import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StateType } from 'src/common/type/common.type';

@Injectable()
export class DynamicAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const url = request.url;

    let provider = request.params.provider;

    if (!provider) {
      if (url.includes('kakao')) {
        provider = 'kakao';
      } else if (url.includes('google')) {
        provider = 'google';
      }
    }

    if (!['google', 'kakao'].includes(provider)) {
      throw new BadRequestException(`Unsupported provider: ${provider}`);
    }

    // 요청 객체에 provider 정보를 추가
    request.authProvider = provider;

    // 동적으로 Guard 생성
    const guard = new (AuthGuard(provider))();

    // getAuthenticateOptions 메소드를 오버라이드하여 state 전달
    guard.getAuthenticateOptions = (context: ExecutionContext) => {
      const request = context.switchToHttp().getRequest();

      // 프로토콜과 호스트 정보를 가져옴
      const protocol = request.protocol;
      const host = request.get('host');

      // 필요한 경우, 프록시를 통해 전달된 원래 프로토콜과 호스트를 가져옴
      const forwardedProto = request.headers['x-forwarded-proto'];
      const forwardedHost = request.headers['x-forwarded-host'];

      const clientProtocol = forwardedProto || protocol;
      const clientHost = forwardedHost || host;

      // state에 포함할 객체 생성
      let state: StateType = {
        protocol: clientProtocol,
        host: clientHost,
      };

      // 기존의 redirect_uri와 register_uri도 포함
      if (request.query.redirect_uri && request.query.register_uri) {
        state = {
          ...state,
          redirect_uri: request.query.redirect_uri,
          register_uri: request.query.register_uri,
        };
      }

      // state 객체를 JSON 문자열로 변환
      return { state: JSON.stringify(state) };
    };

    return guard.canActivate(context) as boolean;
  }
}
