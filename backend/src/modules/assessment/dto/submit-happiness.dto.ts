import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * 幸福力单题答案
 */
export class HappinessAnswerDto {
  @IsString()
  @IsNotEmpty()
  questionId: string; // 题目ID (如 'D1-Q1')

  @IsNumber()
  @IsNotEmpty()
  score: number; // 选中的分数 (根据题目选项，可能是0-7分)
}

/**
 * 提交幸福力测评DTO
 */
export class SubmitHappinessDto {
  @IsString()
  @IsNotEmpty()
  userId: string; // 用户ID

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HappinessAnswerDto)
  answers: HappinessAnswerDto[]; // 155道题的答案
}

