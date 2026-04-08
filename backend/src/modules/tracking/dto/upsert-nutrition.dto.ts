import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpsertNutritionDto {
  @ApiProperty({ description: 'Date for the nutrition log (ISO 8601 date)', example: '2026-04-08' })
  @IsDateString()
  date!: string;

  @ApiPropertyOptional({ description: 'Target calories for the day', example: 2200 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  targetCalories?: number;

  @ApiPropertyOptional({ description: 'Actual calories consumed', example: 2050 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  actualCalories?: number;

  @ApiPropertyOptional({ description: 'Target protein in grams', example: 150.0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(0)
  @Type(() => Number)
  targetProteinG?: number;

  @ApiPropertyOptional({ description: 'Actual protein consumed in grams', example: 140.5 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(0)
  @Type(() => Number)
  actualProteinG?: number;

  @ApiPropertyOptional({ description: 'Target carbs in grams', example: 250.0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(0)
  @Type(() => Number)
  targetCarbsG?: number;

  @ApiPropertyOptional({ description: 'Actual carbs consumed in grams', example: 230.0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(0)
  @Type(() => Number)
  actualCarbsG?: number;

  @ApiPropertyOptional({ description: 'Target fat in grams', example: 70.0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(0)
  @Type(() => Number)
  targetFatG?: number;

  @ApiPropertyOptional({ description: 'Actual fat consumed in grams', example: 65.0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(0)
  @Type(() => Number)
  actualFatG?: number;

  @ApiPropertyOptional({ description: 'Optional notes', example: 'Felt great today' })
  @IsOptional()
  @IsString()
  notes?: string;
}
