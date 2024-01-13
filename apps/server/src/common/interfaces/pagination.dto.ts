import { IsNumber } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationInputDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  page: number = 1;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  pageSize: number = 10;
}

export class PaginationResultDto {
  @ApiProperty({
    description: '总数',
  })
  @Expose()
  count: number;

  @ApiProperty()
  @Expose()
  page: number;

  @ApiProperty()
  @Expose()
  pageSize: number;
}
