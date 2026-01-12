import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { AppUser } from './app-user.entity';

@Entity('app_user_profile')
export class AppUserProfile {
  @PrimaryColumn({ name: 'user_id', type: 'varchar', length: 20, comment: '用户ID' })
  userId: string;

  @Column({ name: 'base_info', type: 'json', comment: '基础信息' })
  baseInfo: any;

  @Column({ name: 'ext_info', type: 'json', nullable: true, comment: '扩展信息' })
  extInfo: any;

  @Column({ name: 'mv_score', type: 'decimal', precision: 5, scale: 2, nullable: true, comment: 'MV总分' })
  mvScore: number;

  @Column({ name: 'mv_detail', type: 'json', nullable: true, comment: 'MV各维度得分详情' })
  mvDetail: any;

  @Column({ name: 'service_matchmaker_id', type: 'varchar', length: 20, nullable: true, comment: '服务红娘ID' })
  serviceMatchmakerId: string;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '更新时间' })
  updatedAt: Date;

  @OneToOne(() => AppUser)
  @JoinColumn({ name: 'user_id' })
  user: AppUser;
}

