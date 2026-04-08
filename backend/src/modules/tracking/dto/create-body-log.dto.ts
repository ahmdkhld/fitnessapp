import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBodyLogDto {
  @ApiPropertyOptional({ description: 'Date for the log (ISO 8601). Defaults to today.', example: '2026-04-08' })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({ description: 'Body weight in kilograms', example: 75.5 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(500)
  weightKg?: number;

  @ApiPropertyOptional({ description: 'Waist circumference in centimetres', example: 82 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(300)
  waistCm?: number;

  @ApiPropertyOptional({ description: 'Body fat percentage', example: 18.5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  bodyFatPct?: number;

  @ApiPropertyOptional({ description: 'Energy level (1-10)', example: 7 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  energyLevel?: number;

  @ApiPropertyOptional({ description: 'Hunger level (1-10)', example: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  hungerLevel?: number;

  @ApiPropertyOptional({ description: 'Sleep quality (1-10)', example: 8 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  sleepQuality?: number;

  @ApiPropertyOptional({ description: 'Free-text notes', example: 'Felt great today' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'URL to a body progress photo' })
  @IsOptional()
  @IsString()
  photoUrl?: string;
}
