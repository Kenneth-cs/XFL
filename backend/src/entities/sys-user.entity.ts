import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Store } from './store.entity';
import { Exclude } from 'class-transformer';

export enum SysUserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  MATCHMAKER = 'matchmaker',
}

@Entity('sys_user')
export class SysUser {
  @PrimaryColumn({ type: 'varchar', length: 20, comment: '后台用户ID' })
  id: string;

  @Column({ name: 'store_id', type: 'char', length: 6, nullable: true, comment: '所属门店ID (超级管理员为NULL)' })
  storeId: string;

  @Column({ type: 'varchar', length: 50, comment: '登录账号/姓名' })
  username: string;

  @Exclude()
  @Column({ type: 'varchar', length: 100, comment: '加密密码' })
  password: string;

  @Column({ type: 'varchar', length: 20, nullable: true, comment: '手机号' })
  phone: string;

  @Column({ type: 'varchar', length: 20, comment: '角色' })
  role: SysUserRole;

  @Column({ type: 'tinyint', default: 0, comment: '状态: 1-正常, 0-待审核, -1-禁用' })
  status: number;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '更新时间' })
  updatedAt: Date;

  @ManyToOne(() => Store)
  @JoinColumn({ name: 'store_id' })
  store: Store;
}

