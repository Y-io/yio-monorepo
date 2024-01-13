import { IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { EmailRegisterDto } from './register.dto';

export class LoginSuccessDto {
  @ApiProperty({
    description: '授权 token',
  })
  @Expose()
  accessToken: string;
  @ApiProperty({
    description: '过期时间',
  })
  @Expose()
  expiresIn: string;
}

export class AccountLoginDto {
  @ApiProperty({
    description: '账号',
    example: 'admin',
  })
  @IsString()
  account: string;

  @ApiProperty({
    description: '密码',
    example: 'admin',
  })
  @IsString()
  password: string;
}

export class EmailLoginDto extends EmailRegisterDto {}
