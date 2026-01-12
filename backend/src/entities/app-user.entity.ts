import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Store } from './store.entity';
import { Exclude } from 'class-transformer';

@Entity('app_user')
export class AppUser {
  @PrimaryColumn({ type: 'varchar', length: 20, comment: '前台用户ID' })
  id: string;

  @Column({ name: 'store_id', type: 'char', length: 6, comment: '所属门店ID' })
  storeId: string;

  @Column({ type: 'varchar', length: 20, unique: true, comment: '手机号' })
  phone: string;

  @Exclude()
  @Column({ type: 'varchar', length: 100, comment: '加密密码' })
  password: string;

  @Column({ type: 'tinyint', default: 1, comment: '状态: 1-正常, 0-禁用' })
  status: number;

  @CreateDateColumn({ name: 'created_at', comment: '注册时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '更新时间' })
  updatedAt: Date;

  @ManyToOne(() => Store)
  @JoinColumn({ name: 'store_id' })
  store: Store;
}

