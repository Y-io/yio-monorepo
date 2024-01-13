import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { UserStateEntity } from './user-state.entity';
import { AbstractBaseEntity } from '../../../common/interfaces/abstract-base.entity';
import { hash } from '@node-rs/argon2';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNumber, IsString } from 'class-validator';

@Entity('user')
export class UserEntity extends AbstractBaseEntity {
  @ApiProperty({
    description: '用户名',
    required: false,
  })
  @Expose()
  @IsString()
  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @ApiProperty({
    description: '邮箱',
    required: false,
  })
  @Expose()
  @IsEmail()
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    description: '手机号码',
    required: false,
  })
  @Expose()
  @IsNumber()
  @Column({ unique: true })
  phone: number;

  @ApiProperty({
    description: '用户状态',
    required: false,
  })
  @OneToOne(() => UserStateEntity, (state) => state.user, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  state: UserStateEntity;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password);
  }
}
