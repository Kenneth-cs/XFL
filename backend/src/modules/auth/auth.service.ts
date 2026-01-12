import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SysUser } from '../../entities/sys-user.entity';
import { AppUser } from '../../entities/app-user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(SysUser)
    private sysUserRepository: Repository<SysUser>,
    @InjectRepository(AppUser)
    private appUserRepository: Repository<AppUser>,
    private jwtService: JwtService,
  ) {}

  /**
   * 后台用户登录
   */
  async loginSysUser(username: string, password: string) {
    const user = await this.sysUserRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    if (user.status === -1) {
      throw new UnauthorizedException('账号已被禁用');
    }

    if (user.status === 0) {
      throw new UnauthorizedException('账号待审核，请联系管理员');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      storeId: user.storeId,
      userType: 'sys',
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        storeId: user.storeId,
        phone: user.phone,
      },
    };
  }

  /**
   * 前台用户登录
   */
  async loginAppUser(phone: string, password: string) {
    const user = await this.appUserRepository.findOne({
      where: { phone },
    });

    if (!user) {
      throw new UnauthorizedException('手机号或密码错误');
    }

    if (user.status === 0) {
      throw new UnauthorizedException('账号已被禁用');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('手机号或密码错误');
    }

    const payload = {
      sub: user.id,
      username: user.phone,
      role: 'app_user',
      storeId: user.storeId,
      userType: 'app',
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        phone: user.phone,
        storeId: user.storeId,
      },
    };
  }

  /**
   * 验证Token
   */
  async validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Token无效或已过期');
    }
  }

  /**
   * 密码加密
   */
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  /**
   * 验证密码
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}

