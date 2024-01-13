import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsDate, IsUUID } from 'class-validator';

@Entity()
export abstract class AbstractBaseEntity {
  @ApiProperty({
    description: 'id',
    required: false,
  })
  @Expose()
  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: '创建时间',
    required: false,
  })
  @Type(() => Date)
  @Expose()
  @IsDate()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: '更新时间',
    required: false,
  })
  @Type(() => Date)
  @Expose()
  @IsDate()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: '删除时间',
    required: false,
  })
  @Type(() => Date)
  @Expose()
  @IsDate()
  @DeleteDateColumn()
  deletedAt: Date;
}
