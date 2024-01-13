import { customAlphabet, nanoid } from 'nanoid';

export class Random {
  /**
   * 生成32位随机字符串
   */
  static randomStr(pool?: string, length?: number) {
    if (pool && !length) {
      return nanoid(32);
    }
    if (!pool && length) {
      return customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')(length);
    }
    if (pool && length) {
      return nanoid(length);
    }
    return customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')(32);
  }
  /**
   * 生成 4 位随机验证码
   */
  static verificationCode() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }
}
