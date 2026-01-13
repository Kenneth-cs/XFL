import { Controller, Get, Post, Body, Param, UseGuards, Logger } from '@nestjs/common';
import { AssessmentService } from './assessment.service';
import { SubmitEnneagramDto } from './dto/submit-enneagram.dto';
import { SubmitAttachmentDto } from './dto/submit-attachment.dto';
import { SubmitHappinessDto } from './dto/submit-happiness.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators';

@Controller('assessments')
@UseGuards(JwtAuthGuard)
export class AssessmentController {
  private readonly logger = new Logger(AssessmentController.name);

  constructor(private readonly assessmentService: AssessmentService) {}

  /**
   * 获取九型人格题目
   * GET /api/v1/assessments/enneagram/questions
   */
  @Public()
  @Get('enneagram/questions')
  getEnneagramQuestions() {
    this.logger.log('获取九型人格题目');
    return {
      total: 144,
      questions: this.assessmentService.getEnneagramQuestions(),
    };
  }

  /**
   * 提交九型人格测评
   * POST /api/v1/assessments/enneagram/submit
   */
  @Post('enneagram/submit')
  async submitEnneagram(@Body() dto: SubmitEnneagramDto) {
    this.logger.log(`用户 ${dto.userId} 提交九型人格测评`);
    return await this.assessmentService.submitEnneagram(dto);
  }

  /**
   * 获取依恋关系题目
   * GET /api/v1/assessments/attachment/questions
   */
  @Public()
  @Get('attachment/questions')
  getAttachmentQuestions() {
    this.logger.log('获取依恋关系题目');
    return {
      total: 36,
      questions: this.assessmentService.getAttachmentQuestions(),
    };
  }

  /**
   * 提交依恋关系测评
   * POST /api/v1/assessments/attachment/submit
   */
  @Post('attachment/submit')
  async submitAttachment(@Body() dto: SubmitAttachmentDto) {
    this.logger.log(`用户 ${dto.userId} 提交依恋关系测评`);
    return await this.assessmentService.submitAttachment(dto);
  }

  /**
   * 获取幸福力题目
   * GET /api/v1/assessments/happiness/questions
   */
  @Public()
  @Get('happiness/questions')
  getHappinessQuestions() {
    this.logger.log('获取幸福力题目');
    const { questions, dimensions } = this.assessmentService.getHappinessQuestions();
    return {
      total: questions.length,
      questions,
      dimensions,
    };
  }

  /**
   * 提交幸福力测评
   * POST /api/v1/assessments/happiness/submit
   */
  @Post('happiness/submit')
  async submitHappiness(@Body() dto: SubmitHappinessDto) {
    this.logger.log(`用户 ${dto.userId} 提交幸福力测评`);
    return await this.assessmentService.submitHappiness(dto);
  }

  /**
   * 获取用户测评历史
   * GET /api/v1/assessments/history/:userId
   */
  @Get('history/:userId')
  async getUserHistory(@Param('userId') userId: string) {
    this.logger.log(`获取用户 ${userId} 的测评历史`);
    return await this.assessmentService.getUserHistory(userId);
  }

  /**
   * 获取用户最新测评结果
   * GET /api/v1/assessments/latest/:userId
   */
  @Get('latest/:userId')
  async getUserLatestResults(@Param('userId') userId: string) {
    this.logger.log(`获取用户 ${userId} 的最新测评结果`);
    return await this.assessmentService.getUserLatestResults(userId);
  }
}

