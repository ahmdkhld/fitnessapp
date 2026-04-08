import { Module } from '@nestjs/common';
import { WaterController } from './water.controller';
import { WaterService } from './water.service';
import { BodyLogController } from './body-log.controller';
import { BodyLogService } from './body-log.service';
import { DailyNotesController } from './daily-notes.controller';
import { DailyNotesService } from './daily-notes.service';
import { NutritionController } from './nutrition.controller';
import { NutritionService } from './nutrition.service';

@Module({
  controllers: [WaterController, BodyLogController, DailyNotesController, NutritionController],
  providers: [WaterService, BodyLogService, DailyNotesService, NutritionService],
})
export class TrackingModule {}
