import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { MatchBatch } from './match-batch.entity';
import { AppUser } from './app-user.entity';

@Entity('match_detail')
export class MatchDetail {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ name: 'batch_id', type: 'bigint' })
  batchId: string;

  @ManyToOne(() => MatchBatch, batch => batch.details)
  @JoinColumn({ name: 'batch_id' })
  batch: MatchBatch;

  @Column({ name: 'candidate_id', length: 20 })
  candidateId: string;

  @ManyToOne(() => AppUser)
  @JoinColumn({ name: 'candidate_id' })
  candidate: AppUser;

  @Column({ name: 'mv_diff', type: 'decimal', precision: 5, scale: 2 })
  mvDiff: number;

  @Column({ name: 'is_mv_pass', type: 'tinyint', comment: '1:通过, 0:不通过' })
  isMvPass: number;

  @Column({ name: 'is_personality_pass', type: 'tinyint', comment: '1:通过, 0:不通过' })
  isPersonalityPass: number;

  @Column({ name: 'result_status', type: 'tinyint', comment: '1:通过, 0:不通过' })
  resultStatus: number;

  @Column({ name: 'match_data', type: 'json', nullable: true, comment: '匹配详情数据快照' })
  matchData: any;
}

