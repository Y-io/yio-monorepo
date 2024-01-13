import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

@Entity('user-state')
export class UserStateEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: '是否在线',
    example: false,
  })
  @Expose()
  @IsBoolean()
  @Column({
    type: 'boolean',
    default: false,
  })
  online: boolean;

  @ApiProperty({
    description: '账户是否锁定',
    example: false,
  })
  @Expose()
  @IsBoolean()
  @Column({ type: 'boolean', default: false })
  disable: boolean;

  @ApiProperty({
    description: '最后登录时间',
  })
  @Expose()
  @Column()
  lastLoginTime?: Date;

  @ApiProperty({
    description: '邮箱验证时间',
  })
  @Expose()
  @Column({ nullable: true })
  emailVerified?: Date;

  @OneToOne(() => UserEntity, (user) => user.state)
  user: UserEntity;
}
