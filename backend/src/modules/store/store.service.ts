import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from '../../entities/store.entity';
import { IdGeneratorService } from '../../shared/services/id-generator.service';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    private idGeneratorService: IdGeneratorService,
  ) {}

  /**
   * 创建门店
   */
  async create(createStoreDto: any) {
    // 检查门店名称是否已存在
    const existingStore = await this.storeRepository.findOne({
      where: { name: createStoreDto.name },
    });

    if (existingStore) {
      throw new BadRequestException('门店名称已存在');
    }

    // 生成门店ID
    const storeId = await this.idGeneratorService.generateStoreId();

    const store = this.storeRepository.create({
      id: storeId,
      ...createStoreDto,
    });

    return await this.storeRepository.save(store);
  }

  /**
   * 获取所有门店列表
   */
  async findAll(status?: number) {
    const where: any = {};
    if (status !== undefined) {
      where.status = status;
    }

    return await this.storeRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 根据ID获取门店详情
   */
  async findOne(id: string) {
    const store = await this.storeRepository.findOne({
      where: { id },
    });

    if (!store) {
      throw new NotFoundException('门店不存在');
    }

    return store;
  }

  /**
   * 更新门店信息
   */
  async update(id: string, updateStoreDto: any) {
    const store = await this.findOne(id);

    // 如果更新名称，检查新名称是否已被其他门店使用
    if (updateStoreDto.name && updateStoreDto.name !== store.name) {
      const existingStore = await this.storeRepository.findOne({
        where: { name: updateStoreDto.name },
      });

      if (existingStore) {
        throw new BadRequestException('门店名称已存在');
      }
    }

    Object.assign(store, updateStoreDto);
    return await this.storeRepository.save(store);
  }

  /**
   * 禁用/启用门店
   */
  async toggleStatus(id: string) {
    const store = await this.findOne(id);
    store.status = store.status === 1 ? 0 : 1;
    return await this.storeRepository.save(store);
  }

  /**
   * 删除门店（软删除，实际上是禁用）
   */
  async remove(id: string) {
    const store = await this.findOne(id);
    store.status = 0;
    return await this.storeRepository.save(store);
  }
}

