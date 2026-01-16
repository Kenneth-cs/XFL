import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { AppUser } from './app-user.entity';
import { MatchDetail } from './match-detail.entity';

@Entity('match_batch')
export class MatchBatch {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ name: 'store_id', length: 6 })
  storeId: string;

  @Column({ name: 'initiator_id', length: 20 })
  initiatorId: string;

  @ManyToOne(() => AppUser)
  @JoinColumn({ name: 'initiator_id' })
  initiator: AppUser;

  @Column({ name: 'filter_criteria', type: 'json', nullable: true })
  filterCriteria: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => MatchDetail, detail => detail.batch)
  details: MatchDetail[];
}

