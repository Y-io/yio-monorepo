import { ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../../common/interfaces/query.dto';
import { PaginationResultDto } from '../../../common/interfaces/pagination.dto';
import { UserStateEntity } from '../entities/user-state.entity';
import { UserEntity } from '../entities/user.entity';

export class UserDto extends UserEntity {}

export class UserProfileDto extends UserDto {
  @ApiProperty({
    description: '用户状态',
    type: UserStateEntity,
  })
  @Expose()
  @Type(() => UserStateEntity)
  state: UserStateEntity;
}

export class UserDataDto extends OmitType(UserDto, [
  'createdAt',
  'updatedAt',
  'deletedAt',
]) {}

// 分页参数
export class UserQueryPaginationDto extends PaginationQueryDto {}

// 分页结果
export class UserPaginationResultDto extends PaginationResultDto {
  @ApiProperty({
    description: '用户列表',
    type: UserProfileDto,
    required: true,
    isArray: true,
  })
  @Type(() => UserProfileDto)
  @ValidateNested({
    each: true,
  })
  @Expose()
  list: UserProfileDto[];
}
