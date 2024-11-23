// exclude-null.interceptor.ts
import {
  CallHandler,
  ClassSerializerInterceptor,
  ExecutionContext,
  Injectable,
  StreamableFile,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { removeNullProperty } from 'src/invitation/util/remove-null-property.util';

@Injectable()
export class ExcludeNullInterceptor extends ClassSerializerInterceptor {
  constructor(protected readonly reflector: Reflector) {
    super(reflector);
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data instanceof StreamableFile) {
          return data;
        }

        const options = this.getContextOptions(context);
        const transformed = this.serialize(data, options);
        return this.removeNullPropertyWithConfig(transformed);
      }),
    );
  }

  private removeNullPropertyWithConfig(obj: any) {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.removeNullPropertyWithConfig(item));
    } else if (obj !== null && typeof obj === 'object' && 'config' in obj) {
      obj.config = removeNullProperty(obj.config);
      return obj;
    } else if (obj !== null && typeof obj === 'object') {
      const newObj = {};
      for (const key in obj) {
        newObj[key] = this.removeNullPropertyWithConfig(obj[key]);
      }
      return newObj;
    } else {
      return obj;
    }
  }
}
