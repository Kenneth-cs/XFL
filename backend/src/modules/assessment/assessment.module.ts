import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssessmentController } from './assessment.controller';
import { AssessmentService } from './assessment.service';
import { AssessmentRecord } from '../../entities/assessment-record.entity';
import { EnneagramCalculator } from './calculators/enneagram.calculator';
import { AttachmentCalculator } from './calculators/attachment.calculator';
import { HappinessCalculator } from './calculators/happiness.calculator';

@Module({
  imports: [TypeOrmModule.forFeature([AssessmentRecord])],
  controllers: [AssessmentController],
  providers: [
    AssessmentService,
    EnneagramCalculator,
    AttachmentCalculator,
    HappinessCalculator,
  ],
  exports: [AssessmentService],
})
export class AssessmentModule {}

