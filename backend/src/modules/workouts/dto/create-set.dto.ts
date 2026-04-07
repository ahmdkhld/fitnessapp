import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateSetDto {
  @IsUUID() exerciseId!: string;
  @IsInt() @Min(1) setNumber!: number;

  @IsOptional() @IsInt() reps?: number;
  @IsOptional() @IsNumber() weightKg?: number;
  @IsOptional() @IsNumber() rpe?: number;
  @IsOptional() @IsInt() durationSec?: number;
  @IsOptional() @IsNumber() distanceKm?: number;
  @IsOptional() @IsBoolean() isWarmup?: boolean;
  @IsOptional() @IsBoolean() isFailure?: boolean;
  @IsOptional() @IsInt() restSeconds?: number;
  @IsOptional() @IsString() notes?: string;
}
