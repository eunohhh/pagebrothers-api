import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './admin/admin.module';
import { TemplateModel } from './admin/entity/template.entity';
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
  ENV_ENV,
} from './common/const/env-keys.const';
import { PUBLIC_FOLDER_PATH } from './common/const/path.const';
import { ImageModel } from './common/entity/image.entity';
import { InvitationDesignModel } from './invitation/entity/invitation-design.entity';
import { InvitationMetaModel } from './invitation/entity/invitation-meta.entity';
import { InvitationOwnerModel } from './invitation/entity/invitation-owner.entity';
import { InvitationModel } from './invitation/entity/invitation.entity';
import { OrderModel } from './invitation/entity/order.entity';
import { VisitsCountModel } from './invitation/entity/visits-count.entity';
import { InvitationModule } from './invitation/invitation.module';
import { UsersModel } from './users/entity/users.entity';
import { UsersModule } from './users/users.module';
import { CommentModel } from './widget/entity/comment.entity';
import { ColumnModel } from './widget/entity/rsvp-column.entity';
import { RsvpExtraFieldModel } from './widget/entity/rsvp-extra-fields.entity';
import { RowValueModel } from './widget/entity/rsvp-row-value.entity';
import { RowModel } from './widget/entity/rsvp-row.entity';
import { WidgetConfigModel } from './widget/entity/widget-config.entity';
import { WidgetItemModel } from './widget/entity/widget-item.entity';
import { WidgetModule } from './widget/widget.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      // 4022.jpg
      // http://localhost:3000/public/posts/4022.jpg
      // http://localhost:3000/posts/4022.jpg
      rootPath: PUBLIC_FOLDER_PATH,
      serveRoot: '/public',
    }),
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
        VisitsCountModel,
        RsvpExtraFieldModel,
        OrderModel,
        ColumnModel,
        RowModel,
        RowValueModel,
        CommentModel,
        TemplateModel,
      ],
      // migrations: ['src/migrations/*.ts'],
      synchronize: process.env[ENV_ENV] === 'production' ? false : true,
      ...(process.env[ENV_ENV] === 'production' && {
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),
    AuthModule,
    CommonModule,
    UsersModule,
    InvitationModule,
    WidgetModule,
    AdminModule,
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
// 241207 22:46
