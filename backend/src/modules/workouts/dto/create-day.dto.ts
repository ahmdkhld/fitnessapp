import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateDayDto {
  @IsString() name!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(7)
  dayOfWeek?: number;

  @IsOptional() @IsInt() sortOrder?: number;
  @IsOptional() @IsInt() estimatedDurationMin?: number;
  @IsOptional() @IsString() notes?: string;
}
