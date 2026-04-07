import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ScheduleService } from './schedule.service';

@Injectable()
export class ScheduleCron {
  private readonly logger = new Logger(ScheduleCron.name);

  constructor(private readonly schedule: ScheduleService) {}

  /** Nightly schedule generation for all users — next 7 days. */
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async nightlyRegenerate() {
    this.logger.log('Running nightly schedule regeneration');
    await this.schedule.generateForAllUsers(7);
  }
}
