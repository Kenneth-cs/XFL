import { Controller, Post, Param, UseGuards, Get } from '@nestjs/common';
import { MvService } from './mv.service';
import { RolesGuard } from '../../common/guards';
import { Roles, Public } from '../../common/decorators';
import { SysUserRole } from '../../entities/sys-user.entity';

/**
 * MV值计算接口
 */
@Controller('mv')
export class MvController {
  constructor(private readonly mvService: MvService) {}

  /**
   * 测试接口 - 验证路由是否工作
   */
  @Public()
  @Get('test')
  test() {
    return { message: 'MV模块路由正常' };
  }

  /**
   * 计算指定用户的MV值
   * 权限：需要后台用户权限（红娘及以上）
   */
  @Post('calculate/:userId')
  @UseGuards(RolesGuard)
  @Roles(SysUserRole.SUPER_ADMIN, SysUserRole.ADMIN, SysUserRole.MANAGER, SysUserRole.MATCHMAKER)
  async calculateMv(@Param('userId') userId: string) {
    return await this.mvService.calculateMv(userId);
  }
}

