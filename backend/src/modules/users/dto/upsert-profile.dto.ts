import { Type } from 'class-transformer';
import { IsDate, IsInt, IsOptional, IsNumber, IsString } from 'class-validator';

export class UpsertProfileDto {
  @IsOptional() @IsNumber() heightCm?: number;
  @IsOptional() @IsNumber() weightKg?: number;
  @IsOptional() @IsNumber() bodyFatPct?: number;
  @IsOptional() @IsNumber() waistCm?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateOfBirth?: Date;

  @IsOptional() @IsString() gender?: string;
  @IsOptional() @IsString() activityLevel?: string;
  @IsOptional() @IsInt() dailyWaterGoalMl?: number;
}
