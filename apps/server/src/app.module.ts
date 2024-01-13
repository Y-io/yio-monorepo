import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './domain/user/user.module';
import { CoreModule } from './core/core.module';
import { AuthModule } from './domain/auth/auth.module';

@Module({
  imports: [CoreModule, UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
