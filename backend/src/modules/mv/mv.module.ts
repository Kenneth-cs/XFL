import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MvService } from './mv.service';
import { MvController } from './mv.controller';
import { AppUser } from '../../entities/app-user.entity';
import { AppUserProfile } from '../../entities/app-user-profile.entity';
import { AssessmentRecord } from '../../entities/assessment-record.entity';
import { Store } from '../../entities/store.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppUser, AppUserProfile, AssessmentRecord, Store]),
  ],
  controllers: [MvController],
  providers: [MvService],
  exports: [MvService],
})
export class MvModule {}

