import { Module } from '@nestjs/common';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { ScheduleCron } from './schedule.cron';

@Module({
  controllers: [ScheduleController],
  providers: [ScheduleService, ScheduleCron],
  exports: [ScheduleService],
})
export class ScheduleModule {}
