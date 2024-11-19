import { ClassSerializerInterceptor } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // swagger
  const config = new DocumentBuilder()
    .setTitle('pagebrothers-api')
    .setDescription('pagebrothers api 문서입니다.')
    .setVersion('1.0')
    .addBasicAuth()
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger-ui', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
