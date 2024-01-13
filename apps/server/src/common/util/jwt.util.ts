import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  Algorithm,
  sign as jwtSign,
  verify as jwtVerify,
} from '@node-rs/jsonwebtoken';
import { randomUUID } from 'node:crypto';
import ms from 'ms';
import {
  IUserAccount,
  UserProfile,
} from '../../domain/user/interfaces/user-profile';

export interface UserClaim extends IUserAccount {
  id: string;
}

@Injectable()
export class JwtUtil {
  constructor(private readonly configService: ConfigService) {}

  async createToken(userClaim: UserProfile) {
    const expiresIn = getExpiresIn(
      this.configService.get('JWT_ACCESS_TOKEN_EXPIRES_IN')!,
    );
    const now = getUtcTimestamp();

    const token = await jwtSign(
      {
        data: userClaim,
        iat: now,
        exp: now + expiresIn,
        iss: this.configService.get('JWT_SERVER_ID'),
        sub: userClaim.id,
        aud: userClaim.username || userClaim.email || '',
        jti: randomUUID({
          disableEntropyCache: true,
        }),
      },
      this.configService.get('JWT_PRIVATE_KEY')!,
      {
        algorithm: Algorithm.ES256,
      },
    );

    return {
      accessToken: token,
      expiresIn: expiresIn,
    };
  }

  async refreshToken(userClaim: UserProfile) {
    const expiresIn = getExpiresIn(
      this.configService.get('JWT_REFRESH_TOKEN_EXPIRES_IN')!,
    );
    const now = getUtcTimestamp();

    return jwtSign(
      {
        data: userClaim,
        iat: now,
        exp: now + expiresIn,
        iss: this.configService.get('JWT_SERVER_ID'),
        sub: userClaim.id,
        aud: userClaim.username || userClaim.email || '',
        jti: randomUUID({
          disableEntropyCache: true,
        }),
      },
      this.configService.get('JWT_PRIVATE_KEY')!,
      {
        algorithm: Algorithm.ES256,
      },
    );
  }

  async verifyToken(token: string) {
    const jwtPublicKey = this.configService.get('JWT_PUBLIC_KEY');
    const jwtServerId = this.configService.get('JWT_SERVER_ID');
    const jwtLeeway = Number(this.configService.get('JWT_LEEWAY'));

    try {
      const jwtClaims = await jwtVerify(token, jwtPublicKey, {
        algorithms: [Algorithm.ES256],
        iss: [jwtServerId],
        leeway: jwtLeeway,
        requiredSpecClaims: ['exp', 'iat', 'iss', 'sub'],
      });

      return jwtClaims.data as UserClaim;
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

export const getUtcTimestamp = () => Math.floor(new Date().getTime() / 1000);
export const getExpiresIn = (value: string) => ms(value) / 1000;
