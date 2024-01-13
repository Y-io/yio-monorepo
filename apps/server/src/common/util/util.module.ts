import { Global, Module } from '@nestjs/common';
import { JwtUtil } from './jwt.util';
import { RepoUtil } from './repo.util';

@Global()
@Module({
  providers: [JwtUtil, RepoUtil],
  exports: [JwtUtil, RepoUtil],
})
export class UtilModule {}
