import { IsNotEmpty, IsString, IsOptional, IsDateString, IsEnum, IsNumber } from 'class-validator';

export class CreateServiceTrackDto {
  @IsOptional() // Will be set from req.user
  @IsString()
  storeId?: string;

  @IsNotEmpty()
  @IsString()
  initiatorId: string;

  @IsOptional() // For therapy track, targetId might be null
  @IsString()
  targetId?: string;

  @IsNotEmpty()
  @IsNumber()
  @IsEnum([1, 2, 3]) // 1: Match, 2: Date, 3: Therapy
  type: number;

  @IsOptional()
  @IsNumber()
  status?: number; // Progress status, specific to track type

  @IsOptional()
  feedbackContent?: any; // JSON structure depending on type

  @IsNotEmpty()
  @IsDateString()
  eventTime: Date | string;

  @IsOptional() // Will be set from req.user
  @IsString()
  createdBy?: string;
}

export class UpdateServiceTrackDto {
  @IsOptional()
  @IsNumber()
  status?: number;

  @IsOptional()
  feedbackContent?: any;

  @IsOptional()
  @IsDateString()
  eventTime?: Date | string;
}

