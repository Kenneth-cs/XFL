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

    // Bidirectional query for initiatorId (as per requirement: show in both profiles)
    if (initiatorId) {
      // Simplified query to verify basic functionality first
      qb.andWhere('track.initiatorId = :initiatorId', { initiatorId });
      // qb.andWhere('(track.initiatorId = :initiatorId OR track.targetId = :initiatorId)', { initiatorId });
    } else if (targetId) {
      // If querying specifically by targetId (less common for profile view, but possible)
      qb.andWhere('track.targetId = :targetId', { targetId });
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

    // Enrich with targetName
    // Logic: If I am initiator, show target's name. If I am target, show initiator's name.
    // For simplicity, we'll fetch both user IDs involved.
    
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
        // Determine the "Other Party" based on the query context
        // If viewing initiatorId's profile, the other party is the one that is NOT initiatorId
        // But initiatorId changes per request. 
        // For the display, let's just provide both names, or let frontend decide.
        // Or simpler: display the name of the 'target' role in the interaction if track.initiator == currentProfileUser
        // and 'initiator' role if track.target == currentProfileUser.
        
        // Actually, the frontend likely expects `targetName` to be the "other person".
        let otherId = track.targetId;
        if (initiatorId && track.targetId === initiatorId) {
             otherId = track.initiatorId; // I am the target, so the other is the initiator
        }

        if (otherId) {
             const user = userMap.get(otherId);
             const profile = profileMap.get(otherId);
             track.targetName = profile?.baseInfo?.name || user?.phone || otherId;
        } else {
             // Should not happen for match/date tracks, but possible for therapy
             track.targetName = '无'; 
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
    Object.assign(track, dto);
    return this.trackRepo.save(track);
  }
}

