import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('sys_store')
export class Store {
  @PrimaryColumn({ type: 'char', length: 6, comment: '门店ID (如: XFL001)' })
  id: string;

  @Column({ type: 'varchar', length: 50, comment: '门店名称' })
  name: string;

  @Column({ name: 'mv_template_id', type: 'tinyint', default: 3, comment: 'MV地域方案ID (1-5)' })
  mvTemplateId: number;

  @Column({ name: 'region_info', type: 'json', nullable: true, comment: '省市区地址信息' })
  regionInfo: any;

  @Column({ name: 'contact_person', type: 'varchar', length: 50, nullable: true, comment: '联系人' })
  contactPerson: string;

  @Column({ name: 'contact_phone', type: 'varchar', length: 20, nullable: true, comment: '联系电话' })
  contactPhone: string;

  @Column({ type: 'tinyint', default: 1, comment: '状态: 1-正常, 0-禁用' })
  status: number;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '更新时间' })
  updatedAt: Date;
}

