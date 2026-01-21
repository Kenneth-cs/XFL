import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppUser } from '../../entities/app-user.entity';
import { AppUserProfile } from '../../entities/app-user-profile.entity';
import { AssessmentRecord } from '../../entities/assessment-record.entity';
import { Store } from '../../entities/store.entity';
import {
  MV_SCHEMES,
  MaleMvDimension,
  FemaleMvDimension,
  ScoreRule,
  MvCalculationScheme
} from '../../constants/mv-rules.constant';

/**
 * MV值计算服务
 * 根据用户档案和门店绑定的地域方案计算MV总分及明细
 */
@Injectable()
export class MvService {
  constructor(
    @InjectRepository(AppUser)
    private appUserRepository: Repository<AppUser>,
    @InjectRepository(AppUserProfile)
    private profileRepository: Repository<AppUserProfile>,
    @InjectRepository(AssessmentRecord)
    private assessmentRepository: Repository<AssessmentRecord>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
  ) {}

  /**
   * 计算用户的MV值
   * @param userId 用户ID
   * @returns 计算结果 { mvScore, mvDetail }
   */
  async calculateMv(userId: string) {
    // 1. 获取用户基础信息
    const user = await this.appUserRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 2. 获取用户档案
    const profile = await this.profileRepository.findOne({ where: { userId } });
    if (!profile) {
      throw new NotFoundException('用户档案不存在');
    }

    // 3. 获取门店信息（确定使用哪套MV计算方案）
    const store = await this.storeRepository.findOne({ where: { id: user.storeId } });
    if (!store) {
      throw new NotFoundException('用户所属门店不存在');
    }

    const scheme = MV_SCHEMES[store.mvTemplateId];
    if (!scheme) {
      throw new BadRequestException(`门店绑定的MV方案ID(${store.mvTemplateId})无效`);
    }

    // 4. 根据性别调用不同的计算逻辑
    const gender = profile.baseInfo?.gender;
    if (!gender) {
      throw new BadRequestException('用户性别信息缺失，无法计算MV值');
    }

    let mvDetail: any;
    let mvScore: number;

    if (gender === '男') {
      mvDetail = await this.calculateMaleMv(profile, scheme);
    } else if (gender === '女') {
      mvDetail = await this.calculateFemaleMv(profile, userId, scheme);
    } else {
      throw new BadRequestException('用户性别信息异常');
    }

    // 5. 计算总分
    mvScore = Object.values(mvDetail).reduce((sum: number, item: any) => sum + (item.score || 0), 0) as number;

    // 6. 更新数据库
    profile.mvScore = mvScore;
    profile.mvDetail = mvDetail;
    await this.profileRepository.save(profile);

    return {
      mvScore,
      mvDetail,
      schemeName: scheme.name
    };
  }

  /**
   * 计算男性MV值
   */
  private async calculateMaleMv(profile: AppUserProfile, scheme: MvCalculationScheme) {
    const baseInfo = profile.baseInfo || {};
    const extInfo = profile.extInfo || {};

    const age = this.calculateAge(baseInfo.birthday);
    const height = baseInfo.height;
    const appearance = extInfo.appearance;
    const wealth = this.parseWealth(extInfo.annualIncome, extInfo.housingStatus);
    const education = baseInfo.education;
    const eqScore = Array.isArray(extInfo.eqScore) ? extInfo.eqScore.length : 0;
    const commitment = extInfo.commitmentScore;

    return {
      age: this.evaluateDimension(age, scheme.male[MaleMvDimension.AGE]),
      height: this.evaluateDimension(height, scheme.male[MaleMvDimension.HEIGHT]),
      appearance: this.evaluateDimension(appearance, scheme.male[MaleMvDimension.APPEARANCE]),
      wealth: this.evaluateDimension(wealth, scheme.male[MaleMvDimension.WEALTH]),
      intelligence: this.evaluateDimension(education, scheme.male[MaleMvDimension.INTELLIGENCE]),
      eq: this.evaluateDimension(eqScore, scheme.male[MaleMvDimension.EQ]),
      sexual_ability: this.evaluateDimension(age, scheme.male[MaleMvDimension.SEXUAL_ABILITY]),
      commitment: this.evaluateDimension(commitment, scheme.male[MaleMvDimension.COMMITMENT])
    };
  }

  /**
   * 计算女性MV值
   */
  private async calculateFemaleMv(profile: AppUserProfile, userId: string, scheme: MvCalculationScheme) {
    const baseInfo = profile.baseInfo || {};
    const extInfo = profile.extInfo || {};

    const age = this.calculateAge(baseInfo.birthday);
    const height = baseInfo.height;
    const bmi = this.calculateBmi(baseInfo.height, baseInfo.weight);
    const appearance = extInfo.appearance;
    const braCup = extInfo.braCup;
    const education = baseInfo.education;
    const family = extInfo.parentsMaritalStatus;

    // 性格匹配度：从九型人格测评结果中读取可匹配异性数量
    let personality = 0; // 默认为0（未测评）
    try {
      const enneagramRecord = await this.assessmentRepository.findOne({
        where: { userId, type: 1, isLatest: 1 }, // type=1 九型人格
        order: { createdAt: 'DESC' },
      });

      if (enneagramRecord && enneagramRecord.resultData) {
        // 读取可匹配异性类型数量
        const resultData = enneagramRecord.resultData as any;
        personality = resultData.matchableOppositeCount || 0;
      }
    } catch (error) {
      // 如果查询失败，使用默认值0
      console.warn(`查询用户 ${userId} 九型人格测评结果失败:`, error);
    }

    return {
      age: this.evaluateDimension(age, scheme.female[FemaleMvDimension.AGE]),
      height: this.evaluateDimension(height, scheme.female[FemaleMvDimension.HEIGHT]),
      bmi: this.evaluateDimension(bmi, scheme.female[FemaleMvDimension.BMI]),
      appearance: this.evaluateDimension(appearance, scheme.female[FemaleMvDimension.APPEARANCE]),
      bra_cup: this.evaluateDimension(braCup, scheme.female[FemaleMvDimension.BRA_CUP]),
      education: this.evaluateDimension(education, scheme.female[FemaleMvDimension.EDUCATION]),
      personality: this.evaluateDimension(personality, scheme.female[FemaleMvDimension.PERSONALITY]),
      family: this.evaluateDimension(family, scheme.female[FemaleMvDimension.FAMILY])
    };
  }

  /**
   * 对单个维度进行评分
   */
  private evaluateDimension(value: any, rules: ScoreRule[]): { value: any; score: number; label: string } {
    // 如果值为空，返回默认最低分
    if (value === undefined || value === null || value === '') {
      return { value, score: 0, label: '数据缺失' };
    }

    // 遍历规则，找到第一个匹配的
    for (const rule of rules) {
      if (rule.condition(value)) {
        return {
          value,
          score: rule.score,
          label: rule.label
        };
      }
    }

    // 如果没有匹配的规则，返回0分
    return { value, score: 0, label: '无匹配规则' };
  }

  /**
   * 计算年龄（根据出生日期）
   */
  private calculateAge(birthday: string): number {
    if (!birthday) return 0;
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  /**
   * 计算BMI（体重kg / (身高m)^2）
   */
  private calculateBmi(height: number, weight: number): number {
    if (!height || !weight) return 0;
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  }

  /**
   * 解析财富值（年收入 + 房产情况综合评估）
   * 返回估算的年收入（单位：万）
   */
  private parseWealth(annualIncome?: string, housingStatus?: string): number {
    let wealth = 0;

    // 解析年收入
    if (annualIncome) {
      if (annualIncome.includes('10w以下') || annualIncome.includes('10万以下')) {
        wealth = 8;
      } else if (annualIncome.includes('10w-20w') || annualIncome.includes('10-20')) {
        wealth = 15;
      } else if (annualIncome.includes('20w-50w') || annualIncome.includes('20-50')) {
        wealth = 35;
      } else if (annualIncome.includes('50w-100w') || annualIncome.includes('50-100')) {
        wealth = 75;
      } else if (annualIncome.includes('100w以上') || annualIncome.includes('100万以上')) {
        wealth = 150;
      }
    }

    // 如果有房产，财富值适当提升（简化处理）
    if (housingStatus === '有') {
      wealth = Math.max(wealth, 20); // 至少认为是20W级别
    }

    return wealth;
  }
}

