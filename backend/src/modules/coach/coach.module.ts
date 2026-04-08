import { Module } from '@nestjs/common';
import { CoachController } from './coach.controller';
import { CoachService } from './coach.service';
import { DietPlansModule } from '../diet-plans/diet-plans.module';
import { WorkoutPlansModule } from '../workouts/workout-plans.module';

@Module({
  imports: [DietPlansModule, WorkoutPlansModule],
  controllers: [CoachController],
  providers: [CoachService],
})
export class CoachModule {}
