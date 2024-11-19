import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BearerTokenGuard } from './auth/guard/bearer-token.guard';
import { CommonModule } from './common/common.module';
import {
  ENV_DB_DATABASE_KEY,
  ENV_DB_HOST_KEY,
  ENV_DB_PASSWORD_KEY,
  ENV_DB_PORT_KEY,
  ENV_DB_USERNAME_KEY,
} from './common/const/env-keys.const';
import { ImageModel } from './common/entity/image.entity';
import { InvitationDesignModel } from './invitation/entity/invitation-design.entity';
import { InvitationMetaModel } from './invitation/entity/invitation-meta.entity';
import { InvitationOwnerModel } from './invitation/entity/invitation-owner.entity';
import { InvitationModel } from './invitation/entity/invitation.entity';
import { WidgetConfigModel } from './invitation/entity/widget-config.entity';
import { WidgetItemModel } from './invitation/entity/widget-item.entity';
import { InvitationModule } from './invitation/invitation.module';
import { UsersModel } from './users/entity/users.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'kakao' }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env[ENV_DB_HOST_KEY],
      port: parseInt(process.env[ENV_DB_PORT_KEY]),
      username: process.env[ENV_DB_USERNAME_KEY],
      password: process.env[ENV_DB_PASSWORD_KEY],
      database: process.env[ENV_DB_DATABASE_KEY],
      entities: [
        UsersModel,
        InvitationModel,
        InvitationOwnerModel,
        ImageModel,
        WidgetConfigModel,
        WidgetItemModel,
        InvitationMetaModel,
        InvitationDesignModel,
      ],
      synchronize: true,
    }),
    AuthModule,
    CommonModule,
    UsersModule,
    InvitationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: BearerTokenGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
