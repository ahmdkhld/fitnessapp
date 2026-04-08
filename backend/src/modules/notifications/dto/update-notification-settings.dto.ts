import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateNotificationSettingsDto {
  @ApiPropertyOptional({ description: 'Enable or disable push notifications' })
  @IsOptional()
  @IsBoolean()
  pushEnabled?: boolean;

  @ApiPropertyOptional({ description: 'Enable meal reminders' })
  @IsOptional()
  @IsBoolean()
  mealReminder?: boolean;

  @ApiPropertyOptional({ description: 'Enable supplement reminders' })
  @IsOptional()
  @IsBoolean()
  supplementReminder?: boolean;

  @ApiPropertyOptional({ description: 'Enable water intake reminders' })
  @IsOptional()
  @IsBoolean()
  waterReminder?: boolean;

  @ApiPropertyOptional({ description: 'Enable overdue task reminders' })
  @IsOptional()
  @IsBoolean()
  overdueReminder?: boolean;

  @ApiPropertyOptional({ description: 'Minutes in advance for reminders', minimum: 0, example: 15 })
  @IsOptional()
  @IsInt()
  @Min(0)
  advanceMinutes?: number;
}
