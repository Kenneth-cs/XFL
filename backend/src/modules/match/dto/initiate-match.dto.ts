import { IsString, IsObject, IsOptional, IsNumber } from 'class-validator';

export class MatchCriteriaDto {
  @IsOptional()
  @IsNumber()
  ageMin?: number;

  @IsOptional()
  @IsNumber()
  ageMax?: number;

  @IsOptional()
  @IsNumber()
  heightMin?: number;

  @IsOptional()
  @IsNumber()
  heightMax?: number;

  @IsOptional()
  @IsString()
  educationMin?: string;

  @IsOptional()
  @IsString()
  educationMax?: string;
}

export class InitiateMatchDto {
  @IsString()
  initiatorId: string;

  @IsObject()
  criteria: MatchCriteriaDto;
}

