import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ServiceTrack } from '../../entities/service-track.entity';
import { CreateServiceTrackDto, UpdateServiceTrackDto } from './dto/create-service-track.dto';
import { AppUser } from '../../entities/app-user.entity';
import { AppUserProfile } from '../../entities/app-user-profile.entity';

@Injectable()
export class ServiceTrackService {
  constructor(
    @InjectRepository(ServiceTrack)
    private trackRepo: Repository<ServiceTrack>,
    @InjectRepository(AppUser)
    private appUserRepo: Repository<AppUser>,
    @InjectRepository(AppUserProfile)
    private profileRepo: Repository<AppUserProfile>,
  ) {}

  async create(dto: CreateServiceTrackDto, currentUser: any) {
    const storeId = currentUser.storeId || 'XFL001'; // Fallback for debugging

    const track = this.trackRepo.create({
      ...dto,
      eventTime: new Date(dto.eventTime), // Ensure it's a Date object
      feedbackContent: dto.feedbackContent || {}, // Ensure valid JSON
      createdBy: currentUser.userId || currentUser.id, // Use userId for sys users, id for app users
      storeId: storeId 
    });
    
    console.log('DEBUG: Saving track entity:', JSON.stringify(track));
    
    return this.trackRepo.save(track);
  }

  async findAll(query: any, currentUser: any) {
    console.log('DEBUG: findAll currentUser:', JSON.stringify(currentUser));
    
    const { initiatorId, targetId, type, page = 1, limit = 20 } = query;
    const storeId = currentUser.storeId || 'XFL001'; // Fallback for debugging

    const qb = this.trackRepo.createQueryBuilder('track')
      .orderBy('track.eventTime', 'DESC');

    // Bidirectional query: show records where user is either initiator OR target
    if (initiatorId) {
      qb.andWhere('(track.initiatorId = :userId OR track.targetId = :userId)', { userId: initiatorId });
    } else if (targetId) {
      qb.andWhere('(track.initiatorId = :userId OR track.targetId = :userId)', { userId: targetId });
    }

    if (type) {
      qb.andWhere('track.type = :type', { type: Number(type) }); // Convert to number
    }
    
    // Store isolation
    if (currentUser.role !== 'super_admin') {
        qb.andWhere('track.storeId = :storeId', { storeId });
    }

    const [items, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    // Enrich with both initiator and target information
    const relatedUserIds = new Set<string>();
    items.forEach(t => {
      if (t.initiatorId) relatedUserIds.add(t.initiatorId);
      if (t.targetId) relatedUserIds.add(t.targetId);
    });
    
    const relatedIdsArray = Array.from(relatedUserIds);

    if (relatedIdsArray.length > 0) {
      const users = await this.appUserRepo.find({ where: { id: In(relatedIdsArray) } });
      const profiles = await this.profileRepo.find({ where: { userId: In(relatedIdsArray) } });
      
      const userMap = new Map(users.map(u => [u.id, u]));
      const profileMap = new Map(profiles.map(p => [p.userId, p]));
      
      items.forEach((track: any) => {
        const currentViewUserId = initiatorId || targetId; // The user whose profile we're viewing
        
        // Add initiator info
        const initiatorUser = userMap.get(track.initiatorId);
        const initiatorProfile = profileMap.get(track.initiatorId);
        track.initiatorName = initiatorProfile?.baseInfo?.name || initiatorUser?.phone || track.initiatorId;
        
        // Add target info
        if (track.targetId) {
          const targetUser = userMap.get(track.targetId);
          const targetProfile = profileMap.get(track.targetId);
          track.targetName = targetProfile?.baseInfo?.name || targetUser?.phone || track.targetId;
        } else {
          track.targetName = '无';
        }
        
        // Determine viewer's role (am I the initiator or the target?)
        track.viewerRole = track.initiatorId === currentViewUserId ? 'initiator' : 'target';
        
        // Set "peer" (对方) info based on viewer's role
        if (track.viewerRole === 'initiator') {
          track.peerName = track.targetName;
          track.peerId = track.targetId;
        } else {
          track.peerName = track.initiatorName;
          track.peerId = track.initiatorId;
        }
      });
    }

    return { items, total, page: Number(page), limit: Number(limit) };
  }

  async findOne(id: string) {
    const track: any = await this.trackRepo.findOne({ where: { id } });
    if (!track) throw new NotFoundException('Track not found');
    
    // Enrich with targetName
    if (track.targetId) {
      const user = await this.appUserRepo.findOne({ where: { id: track.targetId } });
      const profile = await this.profileRepo.findOne({ where: { userId: track.targetId } });
      track.targetName = profile?.baseInfo?.name || user?.phone || track.targetId;
    }
    
    return track;
  }

  async update(id: string, dto: UpdateServiceTrackDto, currentUser: any) {
    const track = await this.findOne(id);
    
    // Merge feedbackContent instead of overwriting it
    if (dto.feedbackContent) {
      track.feedbackContent = {
        ...(track.feedbackContent || {}),
        ...dto.feedbackContent
      };
      delete dto.feedbackContent; // Remove from dto to avoid overwriting
    }
    
    Object.assign(track, dto);
    return this.trackRepo.save(track);
  }
}

