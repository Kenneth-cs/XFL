import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { Public, Roles, CurrentUser, CurrentUserData } from '../../common/decorators';
import { RolesGuard } from '../../common/guards';
import { SysUserRole } from '../../entities/sys-user.entity';
import { IsNotEmpty, IsString, IsOptional, IsNumber, IsBoolean, Matches, Length } from 'class-validator';

class RegisterAppUserDto {
  @IsNotEmpty({ message: '手机号不能为空' })
  @IsString()
  phone: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @IsString()
  password: string;

  @IsNotEmpty({ message: '姓名不能为空' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: '性别不能为空' })
  @IsString()
  gender: string;

  @IsNotEmpty({ message: '出生日期不能为空' })
  @IsString()
  birthday: string;

  @IsNotEmpty({ message: '身高不能为空' })
  @IsNumber()
  height: number;

  @IsNotEmpty({ message: '体重不能为空' })
  @IsNumber()
  weight: number;

  @IsNotEmpty({ message: '学历不能为空' })
  @IsString()
  education: string;

  @IsNotEmpty({ message: '婚况不能为空' })
  @IsString()
  marriage: string;

  @IsNotEmpty({ message: '民族不能为空' })
  @IsString()
  ethnicity: string;

  @IsNotEmpty({ message: '归属门店不能为空' })
  @IsString()
  storeId: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}

class RegisterSysUserDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString()
  @Length(3, 20, { message: '用户名长度为 3-20 个字符' })
  username: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @IsString()
  @Length(6, 20, { message: '密码长度为 6-20 个字符' })
  password: string;

  @IsNotEmpty({ message: '真实姓名不能为空' })
  @IsString()
  @Length(2, 20, { message: '姓名长度为 2-20 个字符' })
  name: string;

  @IsNotEmpty({ message: '身份证号不能为空' })
  @IsString()
  @Matches(/^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/, {
    message: '身份证号格式不正确'
  })
  idCard: string;

  @IsNotEmpty({ message: '手机号不能为空' })
  @IsString()
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' })
  phone: string;

  @IsNotEmpty({ message: '所属门店不能为空' })
  @IsString()
  storeId: string;

  @IsNotEmpty({ message: '申请角色不能为空' })
  @IsString()
  role: SysUserRole;

  @IsNotEmpty({ message: '必须同意用户协议' })
  @IsBoolean()
  agreeToTerms: boolean;
}

class CreateSysUserDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString()
  username: string;

  @IsNotEmpty({ message: '所属门店不能为空' })
  @IsString()
  storeId: string;

  @IsNotEmpty({ message: '角色不能为空' })
  @IsString()
  role: SysUserRole;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  password?: string;
}

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 前台用户注册（公开接口）
   */
  @Public()
  @Post('register/app')
  async registerAppUser(@Body() registerDto: RegisterAppUserDto) {
    return await this.userService.registerAppUser(registerDto);
  }

  /**
   * 后台用户自助注册（公开接口）
   */
  @Public()
  @Post('register/sys')
  async registerSysUser(@Body() registerDto: RegisterSysUserDto) {
    if (!registerDto.agreeToTerms) {
      throw new BadRequestException('必须同意用户协议才能注册');
    }
    return await this.userService.registerSysUser(registerDto);
  }

  /**
   * 创建后台用户
   */
  @Post('sys')
  @UseGuards(RolesGuard)
  @Roles(SysUserRole.SUPER_ADMIN, SysUserRole.ADMIN)
  async createSysUser(@Body() createDto: CreateSysUserDto) {
    return await this.userService.createSysUser(createDto);
  }

  /**
   * 获取后台用户列表
   */
  @Get('sys')
  @UseGuards(RolesGuard)
  @Roles(SysUserRole.SUPER_ADMIN, SysUserRole.ADMIN, SysUserRole.MANAGER)
  async findAllSysUsers(
    @CurrentUser() user: CurrentUserData,
    @Query('storeId') queryStoreId?: string,
    @Query('role') role?: SysUserRole,
    @Query('status') statusParam?: string,
  ) {
    // 权限控制：超级管理员可查任意门店（或所有），其他人强制查本门店
    const targetStoreId = user.role === SysUserRole.SUPER_ADMIN 
      ? queryStoreId 
      : user.storeId;
    
    // 转换 status 参数为数字
    const status = statusParam !== undefined ? parseInt(statusParam, 10) : undefined;
      
    return await this.userService.findAllSysUsers(targetStoreId, role, status);
  }

  /**
   * 审核后台用户
   */
  @Patch('sys/:id/approve')
  @UseGuards(RolesGuard)
  @Roles(SysUserRole.SUPER_ADMIN, SysUserRole.ADMIN)
  async approveSysUser(
    @Param('id') id: string,
    @Body('approve') approve: boolean,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    return await this.userService.approveSysUser(id, approve, currentUser);
  }

  /**
   * 更新后台用户状态
   */
  @Patch('sys/:id/status')
  @UseGuards(RolesGuard)
  @Roles(SysUserRole.SUPER_ADMIN, SysUserRole.ADMIN)
  async updateSysUserStatus(
    @Param('id') id: string,
    @Body('status') status: number,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    return await this.userService.updateSysUserStatus(id, status, currentUser);
  }

  /**
   * 更新后台用户角色
   */
  @Patch('sys/:id/role')
  @UseGuards(RolesGuard)
  @Roles(SysUserRole.SUPER_ADMIN, SysUserRole.ADMIN)
  async updateSysUserRole(
    @Param('id') id: string,
    @Body('role') role: SysUserRole,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    return await this.userService.updateSysUserRole(id, role, currentUser);
  }

  /**
   * 重置后台用户密码
   */
  @Patch('sys/:id/reset-password')
  @UseGuards(RolesGuard)
  @Roles(SysUserRole.SUPER_ADMIN)
  async resetSysUserPassword(@Param('id') id: string) {
    return await this.userService.resetSysUserPassword(id);
  }

  /**
   * 获取前台用户列表
   */
  @Get('app')
  @UseGuards(RolesGuard)
  async findAllAppUsers(
    @CurrentUser() user: CurrentUserData,
    @Query('page') pageParam?: string,
    @Query('limit') limitParam?: string,
    @Query('storeId') queryStoreId?: string,
  ) {
    // 权限控制：超级管理员可查任意门店（或所有），其他人强制查本门店
    const targetStoreId = user.role === SysUserRole.SUPER_ADMIN 
      ? queryStoreId 
      : user.storeId;
    
    // 转换分页参数为数字
    const page = pageParam ? parseInt(pageParam, 10) : 1;
    const limit = limitParam ? parseInt(limitParam, 10) : 20;
    
    // 传递当前用户信息，用于手机号脱敏判断
    return await this.userService.findAllAppUsers(targetStoreId, page, limit, user);
  }

  /**
   * 获取用户档案
   */
  @Get('profile/:userId')
  @UseGuards(RolesGuard)
  async getUserProfile(
    @Param('userId') userId: string,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    // 传递当前用户信息，用于手机号脱敏判断
    return await this.userService.getUserProfile(userId, currentUser);
  }

  /**
   * 更新用户档案
   */
  @Patch('profile/:userId')
  @UseGuards(RolesGuard)
  @Roles(SysUserRole.SUPER_ADMIN, SysUserRole.ADMIN, SysUserRole.MANAGER, SysUserRole.MATCHMAKER)
  async updateUserProfile(
    @Param('userId') userId: string,
    @Body() updateDto: any,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    // 传递当前用户信息，用于权限校验（如分配服务红娘）
    return await this.userService.updateUserProfile(userId, updateDto, currentUser);
  }
}

