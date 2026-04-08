import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum AdherencePeriod {
  WEEK = 'week',
  MONTH = 'month',
}

export class AdherenceQueryDto {
  @ApiPropertyOptional({ enum: AdherencePeriod, description: 'Time period for adherence calculation', default: AdherencePeriod.WEEK })
  @IsOptional()
  @IsEnum(AdherencePeriod)
  period?: AdherencePeriod;
}
