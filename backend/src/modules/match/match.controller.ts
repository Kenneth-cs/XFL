import { Controller, Get, Post, Body, Query, Param, UseGuards, ForbiddenException } from '@nestjs/common';
import { MatchService } from './match.service';
import { InitiateMatchDto } from './dto/initiate-match.dto';
import { MatchQueryDto } from './dto/match-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserData } from '../../common/decorators';
import { SysUserRole } from '../../entities/sys-user.entity';

@Controller('matches')
@UseGuards(JwtAuthGuard)
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post('initiate')
  async initiateMatch(@Body() dto: InitiateMatchDto, @CurrentUser() user: CurrentUserData) {
    // 权限控制：超级管理员不能操作匹配业务
    if (user.role === SysUserRole.SUPER_ADMIN) {
      throw new ForbiddenException('请切换对应门店账号进行操作');
    }
    return this.matchService.initiateMatch(dto);
  }

  @Get()
  async getMatches(@Query() query: MatchQueryDto) {
    return this.matchService.getMatches(query);
  }

  @Get('detail/:id')
  async getMatchDetail(@Param('id') id: string) {
    return this.matchService.getMatchDetail(id);
  }
}

