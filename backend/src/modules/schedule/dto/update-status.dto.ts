import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateScheduleStatusDto {
  @IsIn(['pending', 'completed', 'skipped', 'snoozed', 'partial'])
  status!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
