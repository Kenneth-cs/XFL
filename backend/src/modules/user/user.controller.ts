import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Public, Roles, CurrentUser, CurrentUserData } from '../../common/decorators';
import { RolesGuard } from '../../common/guards';
import { SysUserRole } from '../../entities/sys-user.entity';
import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

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
    @Query('storeId') storeId?: string,
    @Query('role') role?: SysUserRole,
    @Query('status') status?: number,
  ) {
    return await this.userService.findAllSysUsers(storeId, role, status);
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
  ) {
    return await this.userService.approveSysUser(id, approve);
  }

  /**
   * 获取前台用户列表
   */
  @Get('app')
  @UseGuards(RolesGuard)
  async findAllAppUsers(
    @CurrentUser() user: CurrentUserData,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    // 非超级管理员只能看自己门店的用户
    const storeId = user.role === SysUserRole.SUPER_ADMIN 
      ? undefined 
      : user.storeId;
    
    return await this.userService.findAllAppUsers(storeId || user.storeId, page, limit);
  }

  /**
   * 获取用户档案
   */
  @Get('profile/:userId')
  async getUserProfile(@Param('userId') userId: string) {
    return await this.userService.getUserProfile(userId);
  }

  /**
   * 更新用户档案
   */
  @Patch('profile/:userId')
  @UseGuards(RolesGuard)
  @Roles(SysUserRole.ADMIN, SysUserRole.MANAGER, SysUserRole.MATCHMAKER)
  async updateUserProfile(
    @Param('userId') userId: string,
    @Body() updateDto: any,
  ) {
    return await this.userService.updateUserProfile(userId, updateDto);
  }
}

