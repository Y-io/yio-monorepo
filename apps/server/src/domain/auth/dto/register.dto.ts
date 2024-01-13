import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UsernameRegisterDto {
  @ApiProperty({
    description: '用户名',
  })
  @IsString()
  username: string;
  @ApiProperty({
    description: '密码',
  })
  @IsString()
  password: string;
}

export class EmailRegisterDto {
  @ApiProperty({
    description: '邮箱',
  })
  @IsString()
  email: string;
  @ApiProperty({
    description: '验证码',
  })
  @IsString()
  code: string;
}

export class PhoneRegisterDto {
  @ApiProperty({
    description: '邮箱',
  })
  @IsString()
  phone: number;
  @ApiProperty({
    description: '验证码',
  })
  @IsString()
  code: string;
}
