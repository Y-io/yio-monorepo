import { Type } from 'class-transformer';
import { IsDefined } from 'class-validator';
import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import { PaginationInputDto } from './pagination.dto';

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class OrderBy {
  [key: string]: Order;
}

export class FilterTwo {
  [key: string]: string | number | boolean;
}

export class Filter {
  [key: string]: string | number | boolean | FilterTwo;
}

export class QueryDto {
  @ApiProperty({
    description: '排序',
    required: false,
  })
  @Type(() => OrderBy)
  @IsDefined()
  orderBy: OrderBy;

  @ApiProperty({
    description: '搜索参数',
    required: false,
  })
  @Type(() => Filter)
  @IsDefined()
  filter: Filter;
}

export class PaginationQueryDto extends PartialType(
  IntersectionType(QueryDto, PaginationInputDto),
) {}
