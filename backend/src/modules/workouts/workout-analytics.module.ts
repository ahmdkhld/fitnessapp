import { Module } from '@nestjs/common';
import { WorkoutAnalyticsController } from './workout-analytics.controller';
import { WorkoutAnalyticsService } from './workout-analytics.service';

@Module({
  controllers: [WorkoutAnalyticsController],
  providers: [WorkoutAnalyticsService],
  exports: [WorkoutAnalyticsService],
})
export class WorkoutAnalyticsModule {}
