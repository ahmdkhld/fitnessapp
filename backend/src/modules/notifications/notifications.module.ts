import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationCron } from './notification.cron';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationCron],
  exports: [NotificationsService],
})
export class NotificationsModule {}
