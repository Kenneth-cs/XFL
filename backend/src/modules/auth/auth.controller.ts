import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../../common/decorators';
import { IsNotEmpty, IsString } from 'class-validator';

class LoginSysUserDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString()
  username: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @IsString()
  password: string;
}

class LoginAppUserDto {
  @IsNotEmpty({ message: '手机号不能为空' })
  @IsString()
  phone: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @IsString()
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 后台用户登录
   */
  @Public()
  @Post('login/sys')
  @HttpCode(HttpStatus.OK)
  async loginSysUser(@Body() loginDto: LoginSysUserDto) {
    return await this.authService.loginSysUser(
      loginDto.username,
      loginDto.password,
    );
  }

  /**
   * 前台用户登录
   */
  @Public()
  @Post('login/app')
  @HttpCode(HttpStatus.OK)
  async loginAppUser(@Body() loginDto: LoginAppUserDto) {
    return await this.authService.loginAppUser(
      loginDto.phone,
      loginDto.password,
    );
  }
}

