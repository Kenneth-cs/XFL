import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('service_track')
export class ServiceTrack {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ name: 'store_id', length: 6 })
  storeId: string;

  @Column({ name: 'initiator_id', length: 20 })
  initiatorId: string;

  @Column({ name: 'target_id', length: 20 })
  targetId: string;

  @Column({ name: 'type', type: 'tinyint', comment: '1:匹配反馈, 2:约见记录, 3:治疗记录' })
  type: number;

  @Column({ name: 'status', type: 'tinyint', comment: '进度状态' })
  status: number;

  @Column({ name: 'feedback_content', type: 'text', nullable: true })
  feedbackContent: string;

  @Column({ name: 'event_time', type: 'datetime' })
  eventTime: Date;

  @Column({ name: 'created_by', length: 20 })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

