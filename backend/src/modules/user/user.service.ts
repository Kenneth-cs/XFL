import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SysUser, SysUserRole } from '../../entities/sys-user.entity';
import { AppUser } from '../../entities/app-user.entity';
import { AppUserProfile } from '../../entities/app-user-profile.entity';
import { IdGeneratorService } from '../../shared/services/id-generator.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(SysUser)
    private sysUserRepository: Repository<SysUser>,
    @InjectRepository(AppUser)
    private appUserRepository: Repository<AppUser>,
    @InjectRepository(AppUserProfile)
    private profileRepository: Repository<AppUserProfile>,
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

    // 生成用户ID
    const userId = await this.idGeneratorService.generateSysUserId(registerDto.storeId);

    // 加密密码
    const hashedPassword = await this.authService.hashPassword(registerDto.password);

    const user = this.sysUserRepository.create({
      id: userId,
      ...registerDto,
      password: hashedPassword,
      status: 0, // 默认为待审核
    });

    return await this.sysUserRepository.save(user);
  }

  /**
   * 更新后台用户状态（禁用/启用）
   */
  async updateSysUserStatus(id: string, status: number) {
    const user = await this.sysUserRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    user.status = status;
    return await this.sysUserRepository.save(user);
  }

  /**
   * 更新后台用户角色
   */
  async updateSysUserRole(id: string, role: SysUserRole) {
    const user = await this.sysUserRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    user.role = role;
    return await this.sysUserRepository.save(user);
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
  async approveSysUser(id: string, approve: boolean) {
    const user = await this.sysUserRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException('用户不存在');
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
   */
  async findAllAppUsers(storeId?: string, page = 1, limit = 20) {
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

    return {
      data: users,
      total,
      page,
      limit,
    };
  }

  /**
   * 获取用户档案
   */
  async getUserProfile(userId: string) {
    const profile = await this.profileRepository.findOne({
      where: { userId },
      relations: ['user'],
    });

    if (!profile) {
      throw new NotFoundException('用户档案不存在');
    }

    return profile;
  }

  /**
   * 更新用户档案
   */
  async updateUserProfile(userId: string, updateDto: any) {
    const profile = await this.profileRepository.findOne({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('用户档案不存在');
    }

    if (updateDto.baseInfo) {
      profile.baseInfo = { ...profile.baseInfo, ...updateDto.baseInfo };
    }

    if (updateDto.extInfo) {
      profile.extInfo = { ...profile.extInfo, ...updateDto.extInfo };
    }

    if (updateDto.serviceMatchmakerId) {
      profile.serviceMatchmakerId = updateDto.serviceMatchmakerId;
    }

    return await this.profileRepository.save(profile);
  }
}

