import { ExecutionContext, SetMetadata } from '@nestjs/common';

export const IS_SKIP_AUTH_KEY = 'is_skip_auth';

/**
 * 跳过认证
 */
export const SkipAuth = () => SetMetadata(IS_SKIP_AUTH_KEY, true);

export function isSkipAuth(context: ExecutionContext) {
  return (
    Reflect.getMetadata(IS_SKIP_AUTH_KEY, context.getClass()) ||
    Reflect.getMetadata(IS_SKIP_AUTH_KEY, context.getHandler())
  );
}
