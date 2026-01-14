import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('sys_store')
export class Store {
  @PrimaryColumn({ type: 'char', length: 6, comment: '门店ID (如: XFL001)' })
  id: string;

  @Column({ type: 'varchar', length: 100, comment: '门店名称' })
  name: string;

  @Column({ name: 'mv_template_id', type: 'tinyint', nullable: false, comment: 'MV地域方案ID (1:广东周边, 2:江浙周边, 3:全国普适, 4:京沪, 5:东北新疆)' })
  mvTemplateId: number;

  @Column({ name: 'business_license_name', type: 'varchar', length: 200, nullable: true, comment: '营业执照名称' })
  businessLicenseName: string;

  @Column({ name: 'credit_code', type: 'varchar', length: 50, nullable: true, comment: '统一社会信用代码' })
  creditCode: string;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: '省份' })
  province: string;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: '市' })
  city: string;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: '区' })
  district: string;

  @Column({ type: 'varchar', length: 200, nullable: true, comment: '详细地址' })
  address: string;

  @Column({ name: 'contact_person', type: 'varchar', length: 50, nullable: true, comment: '联系人' })
  contactPerson: string;

  @Column({ name: 'contact_phone', type: 'varchar', length: 20, nullable: true, comment: '联系方式' })
  contactPhone: string;

  @Column({ name: 'contract_number', type: 'varchar', length: 100, nullable: true, comment: '合同号' })
  contractNumber: string;

  @Column({ name: 'contract_start_date', type: 'date', nullable: true, comment: '签约时间' })
  contractStartDate: Date;

  @Column({ name: 'contract_end_date', type: 'date', nullable: true, comment: '到期时间' })
  contractEndDate: Date;

  @Column({ type: 'tinyint', default: 1, comment: '状态: 1-正常, 0-禁用, -1-已删除(软删除)' })
  status: number;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '更新时间' })
  updatedAt: Date;
}

