import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SysUser } from '../../entities/sys-user.entity';
import { AppUser } from '../../entities/app-user.entity';
import { AppUserProfile } from '../../entities/app-user-profile.entity';
import { AssessmentRecord } from '../../entities/assessment-record.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SysUser, AppUser, AppUserProfile, AssessmentRecord]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

