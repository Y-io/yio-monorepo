import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class IoredisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  public get client() {
    return this.redis;
  }
}
