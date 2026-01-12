import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { SysUserRole } from '../../entities/sys-user.entity';

/**
 * 门店数据隔离守卫
 * 确保用户只能访问自己门店的数据
 */
@Injectable()
export class StoreIsolationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('用户信息不存在');
    }

    // 超级管理员可以跨门店访问
    if (user.role === SysUserRole.SUPER_ADMIN) {
      return true;
    }

    // 检查请求参数或body中的storeId是否与用户的storeId匹配
    const targetStoreId = request.params.storeId || request.body?.storeId || request.query.storeId;
    
    if (targetStoreId && targetStoreId !== user.storeId) {
      throw new ForbiddenException('无权访问其他门店的数据');
    }

    // 将用户的storeId注入到请求中，供后续使用
    request.storeId = user.storeId;

    return true;
  }
}

