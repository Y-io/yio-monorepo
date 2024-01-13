import { Global, Injectable } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Random } from '../common/util/random';
import { IoredisService } from './ioredis';
import { RedisActions } from '../common/constants';

export const getEmailRedisKey = (action: string, email: string) =>
  `${action}#${email}`;

export interface IEmail<T extends Record<string, any>>
  extends Pick<ISendMailOptions, 'to'> {
  context: T;
}

@Global()
@Injectable()
export class EmailService {
  private readonly emailAddress: string;
  private readonly emailPassword: string;
  private readonly emailHost: string;
  constructor(
    private readonly mailService: MailerService,
    private readonly configService: ConfigService,
    private readonly ioredis: IoredisService,
  ) {
    this.emailHost = configService.get('EMAIL_HOST');
    this.emailAddress = configService.get('EMAIL_USER');
    this.emailPassword = configService.get('EMAIL_PASS');
  }

  async sendWelcome(options: IEmail<any>) {
    await this.mailService.sendMail({
      ...options,
      subject: 'welcome',
      template: 'welcome',
    });
  }

  // 发送邮箱注册验证码
  async sendRegistrationVerification(email: string) {
    // 生成验证码
    await this.generateCodeAndSave(
      getEmailRedisKey(RedisActions.EmailRegistration, email),
    );
    // 发送邮件
    await this.mailService.sendMail({
      to: email,
      from: this.emailAddress,
      subject: 'email_verification',
      template: 'email_verification',
    });
  }

  // 验证邮件注册验证码
  async verifyRegistrationCode(email: string, code: string) {
    const cacheCode = await this.ioredis.client.get(
      getEmailRedisKey(RedisActions.EmailRegistration, email),
    );

    return code === cacheCode;
  }
  // 删除注册验证码
  async deleteRegistrationCode(email: string) {
    await this.ioredis.client.del(
      getEmailRedisKey(RedisActions.EmailRegistration, email),
    );
  }

  // 发送邮件登录验证码
  async sendLoginCode(email: string) {
    // 生成验证码
    await this.generateCodeAndSave(
      getEmailRedisKey(RedisActions.EmailLogin, email),
    );

    // 发送邮件
    await this.mailService.sendMail({
      from: this.emailAddress,
      to: email,
      subject: 'login_verification',
      template: 'login_verification',
    });
  }

  // 验证邮件登录验证码
  async verifyLoginCode(email: string, code: string) {
    const cacheCode = await this.ioredis.client.get(
      getEmailRedisKey(RedisActions.EmailLogin, email),
    );

    return code === cacheCode;
  }

  /**
   * 删除登录验证码
   * @param email
   */
  async deleteLoginCode(email: string) {
    await this.ioredis.client.del(
      getEmailRedisKey(RedisActions.EmailLogin, email),
    );
  }

  private async generateCodeAndSave(key: string) {
    // 生成验证码
    const code = Random.verificationCode();
    // 保存验证码
    await this.ioredis.client.set(key, code, 'EX', 60 * 60 * 24);

    return code;
  }
}
