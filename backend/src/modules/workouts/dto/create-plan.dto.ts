import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreatePlanDto {
  @IsString() name!: string;
  @IsOptional() @IsString() goal?: string;
  @IsOptional() @IsString() splitType?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(7)
  daysPerWeek?: number;

  @IsOptional() @IsString() description?: string;
}
