import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { IUserAccount } from './interfaces/user-profile';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async create(dto: CreateUserDto) {
    if (dto.username || dto.email || dto.email) {
      throw new BadRequestException('请输入用户名或者邮箱');
    }

    if (dto.username && !dto.password) {
      // 当使用账号注册的时候，必须提供密码
      throw new BadRequestException('请输入密码');
    }

    const user = await this.findByAccount(dto);

    if (user) throw new BadRequestException('用户已经存在');

    return this.userRepo.save(this.userRepo.create(dto));
  }

  async findByAccount(params: IUserAccount) {
    return this.userRepo.findOne({
      where: [
        { username: params.username },
        {
          email: params.email,
        },
        {
          phone: params.phone,
        },
      ],
      relations: {
        state: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.userRepo.findOne({
      where: {
        id: id,
      },
      relations: {
        state: true,
      },
    });
    if (!user) throw new NotFoundException('用户不存在');

    return user;
  }

  async softDelete(id: string) {
    return this.userRepo.softDelete(id);
  }

  async findAndCount(args: FindManyOptions<UserEntity>) {
    const [list, count] = await this.userRepo.findAndCount(args);

    return { list, count };
  }

  async update(id: string, data: UpdateUserDto) {
    const user = await this.findOne(id);

    return this.userRepo.save(user);
  }
}
