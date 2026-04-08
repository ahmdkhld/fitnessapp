import { IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NutritionQueryDto {
  @ApiProperty({ description: 'Date to query (ISO 8601 date)', example: '2026-04-08' })
  @IsDateString()
  date!: string;
}

export class NutritionRangeQueryDto {
  @ApiProperty({ description: 'Start date (ISO 8601 date)', example: '2026-04-01' })
  @IsDateString()
  from!: string;

  @ApiProperty({ description: 'End date (ISO 8601 date)', example: '2026-04-08' })
  @IsDateString()
  to!: string;
}
