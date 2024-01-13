import {
  CanActivate,
  ContextType,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { isSkipAuth } from '../decorators';
import { JwtUtil } from '../util';
import { UserService } from '../../domain/user/user.service';
import { SUPER_ADMIN } from '../constants';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly jwtUtil: JwtUtil,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { req } = getRequestResponseFromContext(context);
    const token = req.headers['authorization'] ?? '';
    const [type, jwt] = token.split(' ') ?? [];
    const contextType = context.getType<ContextType>();

    if (!jwt && contextType === 'ws') {
      // ws 必须登录
      return false;
    }

    if (isSkipAuth(context)) {
      return true;
    }

    if (!jwt) {
      throw new UnauthorizedException();
    }

    if (type === 'Bearer') {
      const payload = await this.jwtUtil.verifyToken(jwt);

      // 查找到用户
      const user = {
        username: '',
      };

      if (!user) return false;

      // 超级管理员
      if (user?.username === SUPER_ADMIN) return true;

      request.user = user;

      return true;
    }

    return false;
  }
}

export function getRequestResponseFromContext(context: ExecutionContext) {
  switch (context.getType<ContextType>()) {
    case 'http': {
      const http = context.switchToHttp();
      return {
        req: http.getRequest<Request>(),
        res: http.getResponse<Response>(),
      };
    }
    case 'ws': {
      const ws = context.switchToWs();
      const req = ws.getClient().handshake;

      const cookies = req?.headers?.cookie;
      // patch cookies to match auth guard logic
      if (typeof cookies === 'string') {
        req.cookies = cookies
          .split(';')
          .map((v) => v.split('='))
          .reduce(
            (acc, v) => {
              acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(
                v[1].trim(),
              );
              return acc;
            },
            {} as Record<string, string>,
          );
      }

      return { req };
    }
    default:
      throw new Error('Unknown context type for getting request and response');
  }
}

// 检查 Controller 或者 Class Method 是否需要跳过登录校验
