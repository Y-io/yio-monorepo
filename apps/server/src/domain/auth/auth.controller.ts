import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  AccountLoginDto,
  EmailLoginDto,
  EmailRegisterDto,
  LoginSuccessDto,
  UsernameRegisterDto,
} from './dto';
import { SerializeStrict } from '../../common/decorators';
import { EmailService } from '../../core/email.service';

@ApiTags('授权')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) {}
  @ApiOkResponse({
    status: 200,
    type: LoginSuccessDto,
  })
  @ApiBody({ type: AccountLoginDto })
  @SerializeStrict(LoginSuccessDto)
  @Post('account-login')
  async accountLogin(@Body() dto: AccountLoginDto) {
    return this.authService.accountLogin(dto);
  }

  @Post('register')
  async usernameRegister(@Body() dto: UsernameRegisterDto) {
    return this.authService.usernameRegister(dto);
  }

  @Get('email-login-code')
  async sendEmailLoginCode(@Query('email') email: string) {
    await this.emailService.sendLoginCode(email);
    return 'ok';
  }

  @Post('email-login')
  async emailLogin(@Body() dto: EmailLoginDto) {
    return this.authService.emailLogin(dto);
  }

  @Get('email-register-code')
  async emailRegisterCode(@Query('email') email: string) {
    await this.emailService.sendRegistrationVerification(email);
    return 'ok';
  }

  @Post('email-register')
  async emailRegister(@Body() dto: EmailRegisterDto) {
    void this.authService.emailRegister(dto);
  }
}
