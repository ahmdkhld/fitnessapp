import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  IsUUID,
} from 'class-validator';

export class AddDayExerciseDto {
  @IsUUID() exerciseId!: string;

  @IsInt() @Min(1) targetSets!: number;

  @IsOptional() @IsString() targetReps?: string;
  @IsOptional() @IsNumber() targetWeightKg?: number;
  @IsOptional() @IsNumber() targetRpe?: number;
  @IsOptional() @IsInt() targetDurationSec?: number;
  @IsOptional() @IsNumber() targetDistanceKm?: number;
  @IsOptional() @IsInt() restSeconds?: number;
  @IsOptional() @IsString() tempo?: string;
  @IsOptional() @IsString() supersetGroup?: string;
  @IsOptional() @IsNumber() progressionKg?: number;
  @IsOptional() @IsInt() sortOrder?: number;
  @IsOptional() @IsString() notes?: string;
}
