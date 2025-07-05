import { NestFactory } from '@nestjs/core';
import { AppModule } from './route/app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ShareFunction } from './utils/static-function';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('API v1')
    .setDescription(
      `
      The boilerplate API for NestJS devs.
      When API throws an error:
      {
        "errors": [
          {
            "code": "FIELD:Field error",
            "detail": "Message Error"
          }
        ]
      }
    `
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token'
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  if (ShareFunction.isEnableSwagger()) {
    SwaggerModule.setup('swagger-docs', app, document, {
      customCss: `
        img {
          width: auto !important;
          height: 220px !important;
        }
      `,
    });
  }

  await app.listen(3000);
}

bootstrap();
