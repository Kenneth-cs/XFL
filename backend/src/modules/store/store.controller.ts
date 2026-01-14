import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { StoreService } from './store.service';
import { Roles, Public } from '../../common/decorators';
import { RolesGuard } from '../../common/guards';
import { SysUserRole } from '../../entities/sys-user.entity';
import { IsNotEmpty, IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { MV_TEMPLATES } from '../../constants/mv-template.constant';

class CreateStoreDto {
  @IsNotEmpty({ message: '门店名称不能为空' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'MV计算方案不能为空' })
  @IsNumber()
  @Min(1, { message: 'MV方案ID必须在1-5之间' })
  @Max(5, { message: 'MV方案ID必须在1-5之间' })
  mvTemplateId: number;

  @IsOptional()
  @IsString()
  businessLicenseName?: string;

  @IsOptional()
  @IsString()
  creditCode?: string;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  contactPerson?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsString()
  contractNumber?: string;

  @IsOptional()
  contractStartDate?: string;

  @IsOptional()
  contractEndDate?: string;
}

class UpdateStoreDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'MV方案ID必须在1-5之间' })
  @Max(5, { message: 'MV方案ID必须在1-5之间' })
  mvTemplateId?: number;

  @IsOptional()
  @IsString()
  businessLicenseName?: string;

  @IsOptional()
  @IsString()
  creditCode?: string;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  contactPerson?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsString()
  contractNumber?: string;

  @IsOptional()
  contractStartDate?: string;

  @IsOptional()
  contractEndDate?: string;
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
   * 获取MV方案列表（公开接口，供前端下拉选择）
   * 注意：必须放在 :id 路由之前，否则会被 :id 拦截
   */
  @Public()
  @Get('mv-templates/list')
  async getMvTemplates() {
    return MV_TEMPLATES;
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
   * 删除门店（软删除）
   */
  @Delete(':id')
  @Roles(SysUserRole.SUPER_ADMIN)
  async remove(@Param('id') id: string) {
    return await this.storeService.remove(id);
  }
}

