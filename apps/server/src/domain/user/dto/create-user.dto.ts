import { IsEmail, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: '用户名',
    required: false,
  })
  @IsString()
  username?: string;

  @ApiProperty({
    description: '邮箱',
    required: false,
  })
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: '手机号码',
    required: false,
  })
  @IsNumber()
  phone?: number;

  @ApiProperty({
    description: '密码',
  })
  @IsString()
  password?: string;
}
