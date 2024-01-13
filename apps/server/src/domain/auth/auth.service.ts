import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtUtil } from '../../common/util';
import { UserService } from '../user/user.service';
import {
  AccountLoginDto,
  EmailLoginDto,
  EmailRegisterDto,
  UsernameRegisterDto,
} from './dto';
import { isEmail } from 'class-validator';
import { regexIs } from '../../common/util/regex-is';
import { UserEntity } from '../user/entities/user.entity';
import _ from 'lodash';
import { EmailService } from '../../core/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtUtil: JwtUtil,
    private readonly emailService: EmailService,
  ) {}

  async login(user?: any | null) {
    if (!user) throw new NotFoundException('账号或者密码错误');

    if (user?.state?.disable) {
      throw new UnauthorizedException('账号已锁定');
    }

    return this.jwtUtil.createToken(user);
  }
  async accountLogin(dto: AccountLoginDto) {
    let user: UserEntity;

    if (isEmail(dto.account)) {
      user = await this.userService.findByAccount({
        email: dto.account,
      });
    } else if (regexIs.isUsername(dto.account)) {
      user = await this.userService.findByAccount({
        username: dto.account,
      });
    } else if (!_.isNaN(Number(dto.account))) {
      user = await this.userService.findByAccount({
        phone: Number(dto.account),
      });
    }

    return this.login(user);
  }

  async usernameRegister(dto: UsernameRegisterDto) {
    let user = await this.userService.findByAccount({
      username: dto.username,
    });
    if (user) {
      throw new UnauthorizedException('用户已存在');
    }
    if (!dto.password) {
      throw new UnauthorizedException('请输入密码');
    }

    user = await this.userService.create({
      username: dto.username,
      password: dto.password,
    });

    return this.login(user);
  }

  async emailRegister(dto: EmailRegisterDto) {
    const user = await this.userService.create(dto);

    return this.login(user);
  }

  // 邮件登录
  async emailLogin(dto: EmailLoginDto) {
    const user = await this.userService.findByAccount({
      email: dto.email,
    });

    // 校验邮箱登录验证码
    if (!(await this.emailService.verifyLoginCode(dto.email, dto.code))) {
      throw new UnauthorizedException('验证码错误');
    }
    const loginData = await this.login(user);

    // 删除邮件登录验证码
    await this.emailService.deleteLoginCode(dto.email);

    return loginData;
  }
}
