import { IsDateString, IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LogWaterDto {
  @ApiProperty({ description: 'Amount of water in millilitres', minimum: 1, example: 250 })
  @IsInt()
  @Min(1)
  amountMl!: number;

  @ApiPropertyOptional({ description: 'Date for the log entry (ISO 8601). Defaults to today.', example: '2026-04-08' })
  @IsOptional()
  @IsDateString()
  date?: string;
}
