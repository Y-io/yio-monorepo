import { Expose, Type } from 'class-transformer';
import { IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BaseDto {
  @ApiProperty({
    description: '创建时间',
    required: false,
  })
  @Type(() => Date)
  @Expose()
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: '更新时间',
    required: false,
  })
  @Expose()
  @Type(() => Date)
  @IsDate()
  updatedAt: Date;

  @ApiProperty({
    description: '删除的时间戳',
    required: false,
  })
  @Expose()
  @Type(() => Date)
  @IsDate()
  deletedAt: number;
}
