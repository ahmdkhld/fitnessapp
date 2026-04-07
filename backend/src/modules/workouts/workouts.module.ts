import { Module } from '@nestjs/common';
import { ExercisesModule } from './exercises.module';
import { WorkoutPlansModule } from './workout-plans.module';
import { WorkoutSessionsModule } from './workout-sessions.module';
import { WorkoutAnalyticsModule } from './workout-analytics.module';
import { WorkoutSeedService } from './seed/seed.service';

@Module({
  imports: [
    ExercisesModule,
    WorkoutPlansModule,
    WorkoutSessionsModule,
    WorkoutAnalyticsModule,
  ],
  providers: [WorkoutSeedService],
  exports: [
    ExercisesModule,
    WorkoutPlansModule,
    WorkoutSessionsModule,
    WorkoutAnalyticsModule,
  ],
})
export class WorkoutsModule {}
