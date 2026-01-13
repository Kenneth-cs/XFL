import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssessmentRecord } from '../../entities/assessment-record.entity';
import { EnneagramCalculator } from './calculators/enneagram.calculator';
import { AttachmentCalculator } from './calculators/attachment.calculator';
import { HappinessCalculator } from './calculators/happiness.calculator';
import { SubmitEnneagramDto } from './dto/submit-enneagram.dto';
import { SubmitAttachmentDto } from './dto/submit-attachment.dto';
import { SubmitHappinessDto } from './dto/submit-happiness.dto';
import { ENNEAGRAM_QUESTIONS } from '../../constants/questions/enneagram';
import { ATTACHMENT_QUESTIONS } from '../../constants/questions/attachment';
import { HAPPINESS_QUESTIONS } from '../../constants/questions/happiness';

@Injectable()
export class AssessmentService {
  private readonly logger = new Logger(AssessmentService.name);

  constructor(
    @InjectRepository(AssessmentRecord)
    private readonly assessmentRecordRepository: Repository<AssessmentRecord>,
    private readonly enneagramCalculator: EnneagramCalculator,
    private readonly attachmentCalculator: AttachmentCalculator,
    private readonly happinessCalculator: HappinessCalculator,
  ) {}

  /**
   * 获取九型人格题目
   */
  getEnneagramQuestions() {
    return ENNEAGRAM_QUESTIONS;
  }

  /**
   * 获取依恋关系题目
   */
  getAttachmentQuestions() {
    return ATTACHMENT_QUESTIONS;
  }

  /**
   * 获取幸福力题目
   */
  getHappinessQuestions() {
    const { HAPPINESS_QUESTIONS, HAPPINESS_DIMENSIONS } = require('../../constants/questions/happiness');
    return {
      questions: HAPPINESS_QUESTIONS,
      dimensions: HAPPINESS_DIMENSIONS,
    };
  }

  /**
   * 提交九型人格测评
   */
  async submitEnneagram(dto: SubmitEnneagramDto) {
    this.logger.log(`用户 ${dto.userId} 提交九型人格测评，共 ${dto.answers.length} 题`);

    // 1. 计算结果
    const result = this.enneagramCalculator.calculate(dto.answers);

    // 2. 设置旧记录为非最新
    await this.assessmentRecordRepository.update(
      { userId: dto.userId, type: 1, isLatest: 1 },
      { isLatest: 0 },
    );

    // 3. 保存新记录
    const record = this.assessmentRecordRepository.create({
      userId: dto.userId,
      type: 1, // 九型人格
      answers: JSON.stringify(dto.answers),
      resultData: result,
      rawScores: result.rawScores,
      isLatest: 1,
    });

    await this.assessmentRecordRepository.save(record);

    this.logger.log(`九型人格测评结果：Top3 = [${result.top3.join(', ')}]`);

    return {
      recordId: record.id,
      result,
    };
  }

  /**
   * 提交依恋关系测评
   */
  async submitAttachment(dto: SubmitAttachmentDto) {
    this.logger.log(`用户 ${dto.userId} 提交依恋关系测评，选中 ${dto.selectedQuestions.length} 题`);

    // 1. 计算结果
    const result = this.attachmentCalculator.calculate(dto.selectedQuestions);

    // 2. 设置旧记录为非最新
    await this.assessmentRecordRepository.update(
      { userId: dto.userId, type: 2, isLatest: 1 },
      { isLatest: 0 },
    );

    // 3. 保存新记录
    const record = this.assessmentRecordRepository.create({
      userId: dto.userId,
      type: 2, // 依恋关系
      answers: JSON.stringify(dto.selectedQuestions),
      resultData: result,
      rawScores: {
        A: result.anxietyScore,
        B: result.avoidanceScore,
        C: result.securityScore,
      },
      isLatest: 1,
    });

    await this.assessmentRecordRepository.save(record);

    this.logger.log(`依恋关系测评结果：${result.type} (A=${result.anxietyScore}, B=${result.avoidanceScore}, C=${result.securityScore})`);

    return {
      recordId: record.id,
      result,
    };
  }

  /**
   * 提交幸福力测评
   */
  async submitHappiness(dto: SubmitHappinessDto) {
    this.logger.log(`用户 ${dto.userId} 提交幸福力测评，共 ${dto.answers.length} 题`);

    // 1. 计算结果
    const result = this.happinessCalculator.calculate(dto.answers);

    // 2. 设置旧记录为非最新
    await this.assessmentRecordRepository.update(
      { userId: dto.userId, type: 3, isLatest: 1 },
      { isLatest: 0 },
    );

    // 3. 保存新记录
    const record = this.assessmentRecordRepository.create({
      userId: dto.userId,
      type: 3, // 幸福力
      answers: JSON.stringify(dto.answers),
      resultData: result,
      rawScores: result.dimensions.reduce((acc, d) => {
        acc[`D${d.dimensionId}`] = d.rawScore;
        return acc;
      }, {} as Record<string, number>),
      isLatest: 1,
    });

    await this.assessmentRecordRepository.save(record);

    this.logger.log(`幸福力测评结果：平均分 = ${result.averageScore}`);

    return {
      recordId: record.id,
      result,
    };
  }

  /**
   * 获取用户测评历史
   */
  async getUserHistory(userId: string) {
    const records = await this.assessmentRecordRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 50, // 最多返回50条
    });

    return records.map((record) => ({
      id: record.id,
      type: record.type,
      typeName: this.getTypeName(record.type),
      isLatest: record.isLatest === 1,
      createdAt: record.createdAt,
      resultData: record.resultData,
    }));
  }

  /**
   * 获取用户最新测评结果
   */
  async getUserLatestResults(userId: string) {
    const enneagram = await this.assessmentRecordRepository.findOne({
      where: { userId, type: 1, isLatest: 1 },
      order: { createdAt: 'DESC' },
    });

    const attachment = await this.assessmentRecordRepository.findOne({
      where: { userId, type: 2, isLatest: 1 },
      order: { createdAt: 'DESC' },
    });

    const happiness = await this.assessmentRecordRepository.findOne({
      where: { userId, type: 3, isLatest: 1 },
      order: { createdAt: 'DESC' },
    });

    return {
      enneagram: enneagram ? {
        recordId: enneagram.id,
        result: enneagram.resultData,
        createdAt: enneagram.createdAt,
      } : null,
      attachment: attachment ? {
        recordId: attachment.id,
        result: attachment.resultData,
        createdAt: attachment.createdAt,
      } : null,
      happiness: happiness ? {
        recordId: happiness.id,
        result: happiness.resultData,
        createdAt: happiness.createdAt,
      } : null,
    };
  }

  private getTypeName(type: number): string {
    const typeMap = {
      1: '九型人格',
      2: '依恋关系',
      3: '婚恋幸福力',
    };
    return typeMap[type] || '未知类型';
  }
}

