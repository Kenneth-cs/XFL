import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { StoreService } from './store.service';
import { Roles, Public } from '../../common/decorators';
import { RolesGuard } from '../../common/guards';
import { SysUserRole } from '../../entities/sys-user.entity';
import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

class CreateStoreDto {
  @IsNotEmpty({ message: '门店名称不能为空' })
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  mvTemplateId?: number;

  @IsOptional()
  regionInfo?: any;

  @IsOptional()
  @IsString()
  contactPerson?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;
}

class UpdateStoreDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  mvTemplateId?: number;

  @IsOptional()
  regionInfo?: any;

  @IsOptional()
  @IsString()
  contactPerson?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;
}

@Controller('stores')
@UseGuards(RolesGuard)
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  /**
   * 创建门店（仅超级管理员）
   */
  @Post()
  @Roles(SysUserRole.SUPER_ADMIN)
  async create(@Body() createStoreDto: CreateStoreDto) {
    return await this.storeService.create(createStoreDto);
  }

  /**
   * 获取门店列表
   */
  @Public()
  @Get()
  async findAll(@Query('status') status?: number) {
    console.log('API /stores called, raw status:', status, 'typeof:', typeof status);
    
    // 防御性编程：如果 status 转换后是 NaN，则强制设为 undefined
    if (status !== undefined && isNaN(Number(status))) {
      console.log('Status is NaN, resetting to undefined');
      status = undefined;
    }
    
    return await this.storeService.findAll(status);
  }

  /**
   * 获取门店详情
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.storeService.findOne(id);
  }

  /**
   * 更新门店信息
   */
  @Patch(':id')
  @Roles(SysUserRole.SUPER_ADMIN)
  async update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    return await this.storeService.update(id, updateStoreDto);
  }

  /**
   * 切换门店状态（禁用/启用）
   */
  @Patch(':id/toggle-status')
  @Roles(SysUserRole.SUPER_ADMIN)
  async toggleStatus(@Param('id') id: string) {
    return await this.storeService.toggleStatus(id);
  }

  /**
   * 删除门店
   */
  @Delete(':id')
  @Roles(SysUserRole.SUPER_ADMIN)
  async remove(@Param('id') id: string) {
    return await this.storeService.remove(id);
  }
}

