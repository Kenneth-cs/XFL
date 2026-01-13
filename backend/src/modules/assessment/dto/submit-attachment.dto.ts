import { IsArray, IsNotEmpty, IsString } from 'class-validator';

/**
 * 提交依恋关系测评DTO
 */
export class SubmitAttachmentDto {
  @IsString()
  @IsNotEmpty()
  userId: string; // 用户ID

  @IsArray()
  @IsString({ each: true })
  selectedQuestions: string[]; // 选中的题目ID数组（如 ['A1', 'A5', 'B3', 'C10']）
}

