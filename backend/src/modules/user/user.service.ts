import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SysUser, SysUserRole } from '../../entities/sys-user.entity';
import { AppUser } from '../../entities/app-user.entity';
import { AppUserProfile } from '../../entities/app-user-profile.entity';
import { AssessmentRecord } from '../../entities/assessment-record.entity';
import { IdGeneratorService } from '../../shared/services/id-generator.service';
import { AuthService } from '../auth/auth.service';
import { CurrentUserData } from '../../common/decorators';
import { maskPhone, maskUsersPhone } from '../../shared/utils/phone.util';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(SysUser)
    private sysUserRepository: Repository<SysUser>,
    @InjectRepository(AppUser)
    private appUserRepository: Repository<AppUser>,
    @InjectRepository(AppUserProfile)
    private profileRepository: Repository<AppUserProfile>,
    @InjectRepository(AssessmentRecord)
    private assessmentRepository: Repository<AssessmentRecord>,
    private idGeneratorService: IdGeneratorService,
    private authService: AuthService,
  ) {}

  /**
   * 创建后台用户
   */
  async createSysUser(createDto: any) {
    // 检查用户名是否已存在
    const existingUser = await this.sysUserRepository.findOne({
      where: { username: createDto.username },
    });

    if (existingUser) {
      throw new BadRequestException('用户名已存在');
    }

    // 如果提供了手机号，检查是否已存在
    if (createDto.phone) {
      const existingPhone = await this.sysUserRepository.findOne({
        where: { phone: createDto.phone },
      });

      if (existingPhone) {
        throw new BadRequestException('手机号已被注册');
      }
    }

    // 生成用户ID
    const userId = await this.idGeneratorService.generateSysUserId(createDto.storeId);

    // 加密密码（默认密码为123456）
    const hashedPassword = await this.authService.hashPassword(
      createDto.password || '123456',
    );

    const user = this.sysUserRepository.create({
      id: userId,
      ...createDto,
      password: hashedPassword,
    });

    return await this.sysUserRepository.save(user);
  }

  /**
   * 后台用户自助注册（无需权限，状态为待审核）
   */
  async registerSysUser(registerDto: any) {
    // 禁止注册为超级管理员
    if (registerDto.role === SysUserRole.SUPER_ADMIN) {
      throw new BadRequestException('超级管理员角色只能通过系统预设，不允许注册');
    }

    // 检查用户名是否已存在
    const existingUser = await this.sysUserRepository.findOne({
      where: { username: registerDto.username },
    });

    if (existingUser) {
      throw new BadRequestException('用户名已存在');
    }

    // 检查手机号
    if (registerDto.phone) {
      const existingPhone = await this.sysUserRepository.findOne({
        where: { phone: registerDto.phone },
      });

      if (existingPhone) {
        throw new BadRequestException('手机号已被注册');
      }
    }

    // 检查身份证号
    if (registerDto.idCard) {
      const existingIdCard = await this.sysUserRepository.findOne({
        where: { idCard: registerDto.idCard },
      });

      if (existingIdCard) {
        throw new BadRequestException('该身份证号已被注册');
      }
    }

    // 生成用户ID
    const userId = await this.idGeneratorService.generateSysUserId(registerDto.storeId);

    // 加密密码
    const hashedPassword = await this.authService.hashPassword(registerDto.password);

    const user = this.sysUserRepository.create({
      id: userId,
      storeId: registerDto.storeId,
      username: registerDto.username,
      name: registerDto.name,
      idCard: registerDto.idCard,
      phone: registerDto.phone,
      role: registerDto.role,
      password: hashedPassword,
      status: 0, // 默认为待审核
    });

    return await this.sysUserRepository.save(user);
  }

  /**
   * 更新后台用户状态（禁用/启用）
   */
  async updateSysUserStatus(id: string, status: number, currentUser: CurrentUserData) {
    const user = await this.sysUserRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 1. 不能禁用自己 (防止误操作导致无法登录)
    if (user.id === currentUser.userId) {
      throw new ForbiddenException('不能修改自己的账号状态');
    }

    // 2. 权限校验
    if (currentUser.role === SysUserRole.ADMIN) {
      // 2.1 只能操作本门店
      if (user.storeId !== currentUser.storeId) {
        throw new ForbiddenException('无权操作其他门店的用户');
      }
      
      // 2.2 不能操作超级管理员
      if (user.role === SysUserRole.SUPER_ADMIN) {
        throw new ForbiddenException('无权操作超级管理员');
      }

      // 2.3 不能操作其他老板（虽然理论上一个门店只有一个老板，但为了安全）
      if (user.role === SysUserRole.ADMIN) {
         throw new ForbiddenException('无权操作其他老板账号');
      }
    }

    user.status = status;
    return await this.sysUserRepository.save(user);
  }

  /**
   * 更新后台用户角色
   */
  async updateSysUserRole(id: string, role: SysUserRole, currentUser: CurrentUserData) {
    const targetUser = await this.sysUserRepository.findOne({ where: { id } });
    if (!targetUser) {
      throw new NotFoundException('用户不存在');
    }

    // 1. 检查是否在修改自己的角色
    if (targetUser.id === currentUser.userId) {
      throw new ForbiddenException('不能修改自己的角色');
    }

    // 2. 禁止将任何用户设置为超级管理员（超级管理员只能通过数据库预设）
    if (role === SysUserRole.SUPER_ADMIN) {
      throw new ForbiddenException('超级管理员角色只能通过系统预设，不允许通过界面设置');
    }

    // 3. 检查权限层级
    // 如果当前操作者是超级管理员，可以执行其他操作
    if (currentUser.role === SysUserRole.SUPER_ADMIN) {
      // 通过，允许修改为 admin, manager, matchmaker
    } 
    // 如果当前操作者是门店老板 (ADMIN)
    else if (currentUser.role === SysUserRole.ADMIN) {
      // 3.1 检查是否跨门店操作
      if (targetUser.storeId !== currentUser.storeId) {
        throw new ForbiddenException('无权修改其他门店用户的角色');
      }

      // 3.2 检查目标用户角色等级
      // 不能修改超级管理员
      if (targetUser.role === SysUserRole.SUPER_ADMIN) {
        throw new ForbiddenException('无权修改超级管理员的角色');
      }
      
      // 3.3 检查目标角色设定
      // 门店老板只能将下属修改为 MANAGER 或 MATCHMAKER，不能提升为 ADMIN
      if (role === SysUserRole.ADMIN) {
        throw new ForbiddenException('门店老板无权提升用户为门店老板');
      }
    } 
    // 其他角色（MANAGER/MATCHMAKER）应该在 Controller 层就被 RolesGuard 拦截了，这里做兜底
    else {
      throw new ForbiddenException('权限不足');
    }

    targetUser.role = role;
    return await this.sysUserRepository.save(targetUser);
  }

  /**
   * 重置后台用户密码
   */
  async resetSysUserPassword(id: string) {
    const user = await this.sysUserRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    // 默认重置为 123456
    user.password = await this.authService.hashPassword('123456');
    return await this.sysUserRepository.save(user);
  }

  /**
   * 获取后台用户列表
   */
  async findAllSysUsers(storeId?: string, role?: SysUserRole, status?: number) {
    const where: any = {};
    if (storeId) where.storeId = storeId;
    if (role) where.role = role;
    if (status !== undefined) where.status = status;

    return await this.sysUserRepository.find({
      where,
      order: { createdAt: 'DESC' },
      select: ['id', 'storeId', 'username', 'phone', 'role', 'status', 'createdAt', 'updatedAt'],
    });
  }

  /**
   * 审核后台用户（通过/拒绝）
   */
  async approveSysUser(id: string, approve: boolean, currentUser: CurrentUserData) {
    const user = await this.sysUserRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 权限校验
    if (currentUser.role === SysUserRole.ADMIN) {
      // 1. 只能审核本门店
      if (user.storeId !== currentUser.storeId) {
        throw new ForbiddenException('无权审核其他门店的用户');
      }
      
      // 2. 不能审核老板或超级管理员角色的申请（虽然注册时前端可能限制了，但后端必须兜底）
      if (user.role === SysUserRole.SUPER_ADMIN || user.role === SysUserRole.ADMIN) {
        throw new ForbiddenException('门店老板无权审核老板或超级管理员角色的申请');
      }
    }

    user.status = approve ? 1 : -1;
    return await this.sysUserRepository.save(user);
  }

  /**
   * 注册前台用户
   */
  async registerAppUser(registerDto: any) {
    // 检查手机号是否已注册
    const existingUser = await this.appUserRepository.findOne({
      where: { phone: registerDto.phone },
    });

    if (existingUser) {
      throw new BadRequestException('该手机号已被注册');
    }

    // 生成用户ID
    const userId = await this.idGeneratorService.generateAppUserId(registerDto.storeId);

    // 加密密码
    const hashedPassword = await this.authService.hashPassword(registerDto.password);

    // 创建用户
    const user = this.appUserRepository.create({
      id: userId,
      storeId: registerDto.storeId,
      phone: registerDto.phone,
      password: hashedPassword,
    });

    const savedUser = await this.appUserRepository.save(user);

    // 创建用户档案
    const profile = this.profileRepository.create({
      userId: savedUser.id,
      baseInfo: {
        name: registerDto.name,
        gender: registerDto.gender,
        birthday: registerDto.birthday,
        height: registerDto.height,
        weight: registerDto.weight,
        education: registerDto.education,
        marriage: registerDto.marriage,
        ethnicity: registerDto.ethnicity,
        avatarUrl: registerDto.avatarUrl,
      },
    });

    await this.profileRepository.save(profile);

    return {
      id: savedUser.id,
      phone: savedUser.phone,
      storeId: savedUser.storeId,
    };
  }

  /**
   * 获取前台用户列表（支持超级管理员跨店查询）
   * @param storeId 如果为 undefined，则查询所有门店（仅限超级管理员场景）
   * @param currentUser 当前登录用户信息（用于判断是否需要手机号脱敏）
   */
  async findAllAppUsers(storeId?: string, page = 1, limit = 20, currentUser?: CurrentUserData) {
    const where: any = {};
    // 只有当 storeId 存在时才添加过滤条件
    // 配合 Controller 层的逻辑：非超管必须传 storeId，超管可不传
    if (storeId) {
      where.storeId = storeId;
    }

    const [users, total] = await this.appUserRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    // 手机号脱敏：普通红娘看不到完整手机号
    const shouldMask = currentUser?.role === SysUserRole.MATCHMAKER;
    const maskedUsers = maskUsersPhone(users, shouldMask);

    return {
      data: maskedUsers,
      total,
      page,
      limit,
    };
  }

  /**
   * 获取用户档案
   * @param userId 用户ID
   * @param currentUser 当前登录用户信息（用于判断是否需要手机号脱敏）
   */
  async getUserProfile(userId: string, currentUser?: CurrentUserData) {
    const profile = await this.profileRepository.findOne({
      where: { userId },
      relations: ['user'],
    });

    if (!profile) {
      throw new NotFoundException('用户档案不存在');
    }

    // 手机号脱敏：普通红娘看不到完整手机号
    if (currentUser?.role === SysUserRole.MATCHMAKER && profile.user?.phone) {
      profile.user.phone = maskPhone(profile.user.phone);
    }

    // 获取测评记录
    const assessments = await this.assessmentRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    // 整理测评结果 (取最新的)
    const assessmentResults = {
      enneagram: assessments.find(a => a.type === 1),
      attachment: assessments.find(a => a.type === 2),
      happiness: assessments.find(a => a.type === 3),
    };

    return {
      ...profile,
      assessmentResults,
    };
  }

  /**
   * 更新用户档案
   * @param userId 用户ID
   * @param updateDto 更新数据
   * @param currentUser 当前登录用户信息（用于权限校验）
   */
  async updateUserProfile(userId: string, updateDto: any, currentUser?: CurrentUserData) {
    const profile = await this.profileRepository.findOne({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('用户档案不存在');
    }

    // 权限校验：分配服务红娘（service_matchmaker_id）只能由门店负责人及以上角色操作
    if (updateDto.serviceMatchmakerId !== undefined) {
      // 检查当前用户角色
      if (currentUser) {
        const canAssignMatchmaker = 
          currentUser.role === SysUserRole.SUPER_ADMIN ||
          currentUser.role === SysUserRole.ADMIN ||
          currentUser.role === SysUserRole.MANAGER;

        if (!canAssignMatchmaker) {
          throw new ForbiddenException('只有门店负责人及以上角色才能分配服务红娘');
        }
      }

      profile.serviceMatchmakerId = updateDto.serviceMatchmakerId;
    }

    if (updateDto.baseInfo) {
      profile.baseInfo = { ...profile.baseInfo, ...updateDto.baseInfo };
    }

    if (updateDto.extInfo) {
      profile.extInfo = { ...profile.extInfo, ...updateDto.extInfo };
    }

    return await this.profileRepository.save(profile);
  }
}

