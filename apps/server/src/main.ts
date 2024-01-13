import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;
  const globalPrefix = 'api';

  app.setGlobalPrefix(globalPrefix);
  // 版本号
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'],
  });

  // 全局参数过滤
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  // 启用 gzip 压缩
  app.use(compression());

  // handleSwagger(app);

  await app.listen(port);

  Logger.log(`🚀 应用程序正在运行: http://localhost:${port}`);
}
bootstrap();
