import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * 测评记录表
 * 存储用户测评的答案和结果
 */
@Entity('assessment_record')
export class AssessmentRecord {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true, comment: '记录ID' })
  id: string;

  @Column({ name: 'user_id', type: 'varchar', length: 20, comment: '用户ID' })
  userId: string;

  @Column({ type: 'tinyint', comment: '测评类型: 1-九型人格, 2-依恋关系, 3-婚恋幸福力' })
  type: number;

  @Column({ type: 'json', comment: '用户答案（JSON格式）' })
  answers: string;

  @Column({ name: 'result_data', type: 'json', comment: '测评结果（JSON格式）' })
  resultData: any;

  @Column({ name: 'raw_scores', type: 'json', nullable: true, comment: '原始得分数据' })
  rawScores: any;

  @Column({ name: 'is_latest', type: 'tinyint', default: 0, comment: '是否最新记录: 1-是, 0-否' })
  isLatest: number;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '更新时间' })
  updatedAt: Date;
}

