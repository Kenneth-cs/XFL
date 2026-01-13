import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * 九型人格单题答案
 */
export class EnneagramAnswerDto {
  @IsNumber()
  @IsNotEmpty()
  questionId: number; // 题号 1-144

  @IsNumber()
  @IsNotEmpty()
  selectedType: number; // 选中的人格类型 1-9
}

/**
 * 提交九型人格测评DTO
 */
export class SubmitEnneagramDto {
  @IsString()
  @IsNotEmpty()
  userId: string; // 用户ID

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EnneagramAnswerDto)
  answers: EnneagramAnswerDto[]; // 144道题的答案
}

