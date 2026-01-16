import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not, Brackets } from 'typeorm';
import { MatchBatch } from '../../entities/match-batch.entity';
import { MatchDetail } from '../../entities/match-detail.entity';
import { AppUser } from '../../entities/app-user.entity';
import { AppUserProfile } from '../../entities/app-user-profile.entity';
import { ServiceTrack } from '../../entities/service-track.entity';
import { AssessmentRecord } from '../../entities/assessment-record.entity';
import { InitiateMatchDto } from './dto/initiate-match.dto';
import { MatchQueryDto } from './dto/match-query.dto';
import { checkEnneagramMatch } from '../../utils/enneagram-match.util';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(MatchBatch)
    private batchRepo: Repository<MatchBatch>,
    @InjectRepository(MatchDetail)
    private detailRepo: Repository<MatchDetail>,
    @InjectRepository(AppUser)
    private userRepo: Repository<AppUser>,
    @InjectRepository(AppUserProfile)
    private profileRepo: Repository<AppUserProfile>,
    @InjectRepository(ServiceTrack)
    private trackRepo: Repository<ServiceTrack>,
    @InjectRepository(AssessmentRecord)
    private assessmentRepo: Repository<AssessmentRecord>,
  ) {}

  /**
   * 发起匹配
   */
  async initiateMatch(dto: InitiateMatchDto) {
    const { initiatorId, criteria } = dto;

    // 1. 获取发起人信息 (包含档案和九型结果)
    const initiator = await this.userRepo.findOne({ where: { id: initiatorId } });
    if (!initiator) {
      throw new NotFoundException('发起人不存在');
    }

    const initiatorProfile = await this.profileRepo.findOne({ where: { userId: initiatorId } });
    if (!initiatorProfile) {
      throw new NotFoundException('发起人档案不存在');
    }

    // 获取发起人九型人格结果
    const initiatorEnneagram = await this.assessmentRepo.findOne({
      where: { userId: initiatorId, type: 1, isLatest: 1 },
    });

    const initiatorMv = Number(initiatorProfile.mvScore) || 0;
    const initiatorGender = initiatorProfile.baseInfo?.gender as '男' | '女';
    if (!initiatorGender) {
      throw new NotFoundException('发起人性别未知');
    }
    const targetGender = initiatorGender === '男' ? '女' : '男';

    // 2. 筛选候选人 (初步筛选: 门店, 性别, 基础条件)
    // 注意：由于共享主键一对一关系加载问题，这里手动加载 profile
    const qb = this.userRepo.createQueryBuilder('user')
      .where('user.storeId = :storeId', { storeId: initiator.storeId })
      .andWhere('user.id != :initiatorId', { initiatorId });

    const users = await qb.getMany();

    // 手动批量加载 profile
    const userIds = users.map(u => u.id);
    let profiles: AppUserProfile[] = [];
    if (userIds.length > 0) {
      profiles = await this.profileRepo.findByIds(userIds);
    }
    const profileMap = new Map(profiles.map(p => [p.userId, p]));
    users.forEach(u => {
      u.profile = profileMap.get(u.id);
    });

    // 学历等级映射
    const eduLevels = { 
      '高中及以下': 1, '大专以下': 1, 
      '大专': 2, 
      '二本': 3, '本科': 3, 
      '普通一本': 4, '一本': 4, 
      '硕士': 5, '211大学': 5, 
      '博士': 6, '985或更高': 6 
    };
    const getEduLevel = (edu: string) => eduLevels[edu] || 0;
    const minEduLevel = criteria.educationMin ? getEduLevel(criteria.educationMin) : 0;
    const maxEduLevel = criteria.educationMax ? getEduLevel(criteria.educationMax) : 99;

    // 内存筛选
    const candidates = users.filter(user => {
      const profile = user.profile;
      if (!profile || !profile.baseInfo) return false;

      const baseInfo = profile.baseInfo;

      // 性别筛选
      if (baseInfo.gender !== targetGender) return false;

      // 年龄筛选
      if (criteria.ageMin !== undefined || criteria.ageMax !== undefined) {
        const birthday = baseInfo.birthday;
        if (!birthday) return false;
        const age = new Date().getFullYear() - new Date(birthday).getFullYear();
        if (criteria.ageMin !== undefined && age < criteria.ageMin) return false;
        if (criteria.ageMax !== undefined && age > criteria.ageMax) return false;
      }

      // 身高筛选
      if (criteria.heightMin !== undefined || criteria.heightMax !== undefined) {
        const height = Number(baseInfo.height);
        if (!height) return false;
        if (criteria.heightMin !== undefined && height < criteria.heightMin) return false;
        if (criteria.heightMax !== undefined && height > criteria.heightMax) return false;
      }

      // 学历筛选
      if (criteria.educationMin || criteria.educationMax) {
        const edu = baseInfo.education;
        const level = getEduLevel(edu);
        if (level < minEduLevel || level > maxEduLevel) return false;
      }

      return true;
    });

    // 3. 内存精细筛选 & 排除
    // 获取已存在的服务轨迹 (initiator <-> candidate)
    const existingTracks = await this.trackRepo.find({
      where: [
        { initiatorId: initiatorId },
        { targetId: initiatorId }
      ]
    });
    const excludedIds = new Set<string>();
    existingTracks.forEach(t => {
      if (t.initiatorId === initiatorId) excludedIds.add(t.targetId);
      if (t.targetId === initiatorId) excludedIds.add(t.initiatorId);
    });

    const validCandidates = [];
    const results: any[] = [];

    // 预加载候选人的九型结果 (批量)
    const candidateIds = candidates.map(c => c.id).filter(id => !excludedIds.has(id));
    let candidateEnneagrams: AssessmentRecord[] = [];
    if (candidateIds.length > 0) {
      candidateEnneagrams = await this.assessmentRepo.find({
        where: { userId: In(candidateIds), type: 1, isLatest: 1 }
      });
    }
    const enneagramMap = new Map(candidateEnneagrams.map(e => [e.userId, e.resultData]));

    for (const candidate of candidates) {
      // 排除已有服务轨迹的用户
      if (excludedIds.has(candidate.id)) continue;

      const profile = candidate.profile;
      if (!profile) continue;

      // 4. 匹配运算
      const candidateMv = Number(profile.mvScore) || 0;
      const mvDiff = candidateMv - initiatorMv;
      const isMvPass = Math.abs(mvDiff) <= 5 ? 1 : 0;

      // 九型匹配
      let isPersonalityPass = 0;
      let overlapCount = 0;
      let matchData = {};

      const cEnneagram = enneagramMap.get(candidate.id);
      if (initiatorEnneagram?.resultData && cEnneagram) {
        const iTypes = (initiatorEnneagram.resultData as any).top3 || [];
        const cTypes = (cEnneagram as any).top3 || [];
        
        const check = checkEnneagramMatch(iTypes, initiatorGender, cTypes);
        isPersonalityPass = check.isPass ? 1 : 0;
        overlapCount = check.overlapCount;
        matchData = {
          initiatorTypes: iTypes,
          candidateTypes: cTypes,
          overlapCount,
          initiatorEnneagram: initiatorEnneagram.resultData, // 保存快照
          candidateEnneagram: cEnneagram // 保存快照
        };
      } else {
        // 如果任意一方没做测试，默认为不通过? 或者显示“未测试”
        // 需求: "性格相符则“通过”，不符则“不通过”"
        // 暂定: 未测试算不通过，或者特殊状态。这里暂设计为0
      }

      results.push({
        candidate,
        mvDiff,
        isMvPass,
        isPersonalityPass,
        resultStatus: (isMvPass && isPersonalityPass) ? 1 : 0,
        matchData
      });
    }

    // 5. 保存批次
    const batch = this.batchRepo.create({
      storeId: initiator.storeId,
      initiatorId,
      filterCriteria: criteria,
    });
    await this.batchRepo.save(batch);

    // 6. 保存明细
    const details = results.map(r => this.detailRepo.create({
      batchId: batch.id,
      candidateId: r.candidate.id,
      mvDiff: r.mvDiff,
      isMvPass: r.isMvPass,
      isPersonalityPass: r.isPersonalityPass,
      resultStatus: r.resultStatus,
      matchData: r.matchData
    }));
    await this.detailRepo.save(details);

    return {
      batchId: batch.id,
      count: details.length,
      results: details
    };
  }

  /**
   * 查询匹配记录
   */
  async getMatches(dto: MatchQueryDto) {
    const qb = this.batchRepo.createQueryBuilder('batch')
      .leftJoinAndSelect('batch.initiator', 'initiator')
      .leftJoinAndSelect('initiator.profile', 'iProfile')
      .leftJoinAndSelect('batch.details', 'details')
      .leftJoinAndSelect('details.candidate', 'candidate')
      .leftJoinAndSelect('candidate.profile', 'cProfile')
      .orderBy('batch.createdAt', 'DESC');

    // 发起人筛选
    if (dto.initiatorId) {
      qb.andWhere('batch.initiatorId LIKE :iId', { iId: `%${dto.initiatorId}%` });
    }
    if (dto.initiatorName) {
      qb.andWhere("JSON_UNQUOTE(JSON_EXTRACT(iProfile.base_info, '$.name')) LIKE :iName", { iName: `%${dto.initiatorName}%` });
    }
    if (dto.initiatorPhone) {
      qb.andWhere('initiator.phone LIKE :iPhone', { iPhone: `%${dto.initiatorPhone}%` });
    }

    // 候选人筛选 (复杂: 需要筛选 details 中的 candidate)
    if (dto.candidateId || dto.candidateName || dto.candidatePhone) {
      qb.andWhere(qb => {
        const subQuery = qb.subQuery()
          .select('d.batch_id')
          .from(MatchDetail, 'd')
          .leftJoin('d.candidate', 'c')
          .leftJoin('c.profile', 'cp');
        
        const conditions = [];
        if (dto.candidateId) conditions.push(`d.candidate_id LIKE '%${dto.candidateId}%'`);
        if (dto.candidatePhone) conditions.push(`c.phone LIKE '%${dto.candidatePhone}%'`);
        if (dto.candidateName) conditions.push(`JSON_UNQUOTE(JSON_EXTRACT(cp.base_info, '$.name')) LIKE '%${dto.candidateName}%'`);
        
        return 'batch.id IN ' + subQuery.where(conditions.join(' AND ')).getQuery();
      });
    }

    const page = dto.page || 1;
    const limit = dto.limit || 10;
    
    // 分页
    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
      page,
      limit
    };
  }

  async getMatchDetail(id: string) {
    return this.detailRepo.findOne({
      where: { id },
      relations: ['batch', 'candidate', 'candidate.profile', 'batch.initiator', 'batch.initiator.profile']
    });
  }
}

