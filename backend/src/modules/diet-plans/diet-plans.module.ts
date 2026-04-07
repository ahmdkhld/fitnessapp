import { Module } from '@nestjs/common';
import { DietPlansController } from './diet-plans.controller';
import { DietPlansService } from './diet-plans.service';
import { MealsController } from './meals.controller';
import { MealsService } from './meals.service';

@Module({
  controllers: [DietPlansController, MealsController],
  providers: [DietPlansService, MealsService],
  exports: [DietPlansService, MealsService],
})
export class DietPlansModule {}
