import { SetMetadata } from '@nestjs/common';
import { SysUserRole } from '../../entities/sys-user.entity';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: SysUserRole[]) => SetMetadata(ROLES_KEY, roles);

