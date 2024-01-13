import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserDto,
  UpdateUserDto,
  UserDataDto,
  UserPaginationResultDto,
  UserProfileDto,
  UserQueryPaginationDto,
} from './dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SerializeStrict } from '../../common/decorators';
import { RepoUtil } from '../../common/util';

@ApiTags('用户')
@Controller({
  path: 'users',
  version: '1',
})
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly repoUtil: RepoUtil,
  ) {}

  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    type: UserProfileDto,
  })
  @SerializeStrict(UserProfileDto)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 201,
    type: UserProfileDto,
  })
  @SerializeStrict(UserProfileDto)
  @Patch(':id')
  update(@Query('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @ApiResponse({
    status: 200,
    type: UserDataDto,
  })
  @SerializeStrict(UserDataDto)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @ApiResponse({
    status: 200,
  })
  @SerializeStrict(UserDataDto)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.userService.softDelete(id);
  }

  @ApiResponse({
    status: 200,
    type: [UserPaginationResultDto],
  })
  @SerializeStrict(UserPaginationResultDto)
  @Get()
  async findMany(@Query() queryDto: UserQueryPaginationDto) {
    const data = await this.userService.findAndCount(
      this.repoUtil.findManyArgs(queryDto),
    );

    return {
      page: queryDto.page,
      pageSize: queryDto.pageSize,
      ...data,
    };
  }
}
