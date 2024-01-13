import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envValidation } from './env.validation';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClsGuard, ClsModule } from 'nestjs-cls';
import { IoredisModule, IoredisService } from './ioredis';
import { UtilModule } from '../common/util';
import { EmailService } from './email.service';
import { join } from 'node:path';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { AuthModule } from '../domain/auth/auth.module';

console.log({ __dirname });
@Global()
@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: envValidation,
    }),
    IoredisModule,
    // 速率限制
    ThrottlerModule.forRootAsync({
      inject: [IoredisService],
      useFactory: (redisService: IoredisService) => ({
        storage: new ThrottlerStorageRedisService(redisService.client),
        throttlers: [
          {
            ttl: 60000,
            limit: 10,
          },
        ],
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          entities: [],
          url: configService.get('DATABASE_URL'),
          synchronize: true,
          autoLoadEntities: true,
        };
      },
    }),
    ClsModule.forRoot({
      global: true,
      interceptor: {
        mount: true,
        setup: (cls, context) => {
          const req = context.switchToHttp().getRequest<Request>();
          cls.set('user', req['user'] || undefined);
        },
      },
    }),
    UtilModule,
    // 邮件
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('EMAIL_HOST'),
          port: 587,
          secure: false,
          auth: {
            user: configService.get('EMAIL_USER'),
            pass: configService.get('EMAIL_PASS'),
          },
        },
        template: {
          dir: join(__dirname, '../templates'),
          adapter: new HandlebarsAdapter(),
        },
      }),
    }),
  ],
  providers: [
    EmailService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtGuard,
    // },
    {
      provide: APP_GUARD,
      useClass: ClsGuard,
    },
  ],
  exports: [EmailService],
})
export class CoreModule {}
