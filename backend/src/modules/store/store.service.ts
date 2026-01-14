import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Store } from '../../entities/store.entity';
import { IdGeneratorService } from '../../shared/services/id-generator.service';
import { isValidMvTemplateId } from '../../constants/mv-template.constant';

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
    // 验证 MV 方案 ID
    if (!isValidMvTemplateId(createStoreDto.mvTemplateId)) {
      throw new BadRequestException('无效的MV方案ID，必须在1-5之间');
    }

    // 检查门店名称是否已存在（排除已删除的门店）
    const existingStore = await this.storeRepository.findOne({
      where: { 
        name: createStoreDto.name,
        status: Not(-1), // 排除已删除的门店
      },
    });

    if (existingStore) {
      throw new BadRequestException('门店名称已存在');
    }

    // 生成门店ID
    const storeId = await this.idGeneratorService.generateStoreId();

    const store = this.storeRepository.create({
      id: storeId,
      ...createStoreDto,
      status: 1, // 默认启用
    });

    return await this.storeRepository.save(store);
  }

  /**
   * 获取所有门店列表
   * @param status - 可选的状态筛选（1-正常, 0-禁用），默认不显示已删除(-1)的门店
   */
  async findAll(status?: number) {
    const where: any = {};
    
    if (status !== undefined) {
      where.status = status;
    } else {
      // 默认不显示已删除的门店
      where.status = Not(-1);
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

    if (!store || store.status === -1) {
      throw new NotFoundException('门店不存在');
    }

    return store;
  }

  /**
   * 更新门店信息
   */
  async update(id: string, updateStoreDto: any) {
    const store = await this.findOne(id);

    // 验证 MV 方案 ID（如果有更新）
    if (updateStoreDto.mvTemplateId && !isValidMvTemplateId(updateStoreDto.mvTemplateId)) {
      throw new BadRequestException('无效的MV方案ID，必须在1-5之间');
    }

    // 如果更新名称，检查新名称是否已被其他门店使用
    if (updateStoreDto.name && updateStoreDto.name !== store.name) {
      const existingStore = await this.storeRepository.findOne({
        where: { 
          name: updateStoreDto.name,
          status: Not(-1), // 排除已删除的门店
        },
      });

      if (existingStore && existingStore.id !== id) {
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
   * 删除门店（软删除，设置 status = -1）
   * 注意：软删除后，门店数据仍保留在数据库中，但在列表中不可见
   */
  async remove(id: string) {
    const store = await this.findOne(id);
    
    // TODO: 后续需要检查门店下是否有关联的用户数据
    // 如果有关联数据，可以提示"该门店下有XX名用户，无法删除"
    
    store.status = -1; // 软删除标记
    return await this.storeRepository.save(store);
  }
}

