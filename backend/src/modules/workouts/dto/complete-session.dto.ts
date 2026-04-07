import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CompleteSessionDto {
  @IsOptional() @IsString() notes?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  energyLevel?: number;
}
