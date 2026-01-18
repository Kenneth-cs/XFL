import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceTrackController } from './service-track.controller';
import { ServiceTrackService } from './service-track.service';
import { ServiceTrack } from '../../entities/service-track.entity';
import { AppUser } from '../../entities/app-user.entity';
import { AppUserProfile } from '../../entities/app-user-profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceTrack, AppUser, AppUserProfile])
  ],
  controllers: [ServiceTrackController],
  providers: [ServiceTrackService],
  exports: [ServiceTrackService]
})
export class ServiceTrackModule {}

