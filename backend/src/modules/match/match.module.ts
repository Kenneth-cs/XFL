import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { MatchBatch } from '../../entities/match-batch.entity';
import { MatchDetail } from '../../entities/match-detail.entity';
import { AppUser } from '../../entities/app-user.entity';
import { AppUserProfile } from '../../entities/app-user-profile.entity';
import { ServiceTrack } from '../../entities/service-track.entity';
import { AssessmentRecord } from '../../entities/assessment-record.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MatchBatch,
      MatchDetail,
      AppUser,
      AppUserProfile,
      ServiceTrack,
      AssessmentRecord,
    ]),
  ],
  controllers: [MatchController],
  providers: [MatchService],
})
export class MatchModule {}

