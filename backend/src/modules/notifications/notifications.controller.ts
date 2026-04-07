import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { NotificationsService } from './notifications.service';

class RegisterDeviceDto {
  @IsOptional() @IsString() fcmToken?: string;
  @IsOptional() @IsString() apnsToken?: string;
}

class UpdateNotificationSettingsDto {
  @IsOptional() @IsBoolean() pushEnabled?: boolean;
  @IsOptional() @IsBoolean() mealReminder?: boolean;
  @IsOptional() @IsBoolean() supplementReminder?: boolean;
  @IsOptional() @IsBoolean() waterReminder?: boolean;
  @IsOptional() @IsBoolean() overdueReminder?: boolean;
  @IsOptional() @IsInt() advanceMinutes?: number;
}

@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notifs: NotificationsService) {}

  @Post('register-device')
  register(@CurrentUser() user: AuthUser, @Body() dto: RegisterDeviceDto) {
    return this.notifs.registerDevice(user.userId, dto.fcmToken, dto.apnsToken);
  }

  @Patch('settings')
  update(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdateNotificationSettingsDto,
  ) {
    return this.notifs.updateSettings(user.userId, dto);
  }
}
