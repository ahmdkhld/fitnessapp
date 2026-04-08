import {
  IsDateString,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class DailyNoteDto {
  @ApiPropertyOptional({ description: 'Date for the note (ISO 8601). Defaults to today.', example: '2026-04-08' })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({ description: 'Symptoms object (key-value pairs)', example: { headache: true, fatigue: false } })
  @IsOptional()
  @IsObject()
  symptoms?: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'Mood rating (1-10)', example: 7 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  mood?: number;

  @ApiPropertyOptional({ description: 'Free-text notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}
