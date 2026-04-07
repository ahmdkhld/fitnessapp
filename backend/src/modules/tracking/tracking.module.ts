import { Module } from '@nestjs/common';
import { WaterController } from './water.controller';
import { WaterService } from './water.service';
import { BodyLogController } from './body-log.controller';
import { BodyLogService } from './body-log.service';
import { DailyNotesController } from './daily-notes.controller';
import { DailyNotesService } from './daily-notes.service';

@Module({
  controllers: [WaterController, BodyLogController, DailyNotesController],
  providers: [WaterService, BodyLogService, DailyNotesService],
})
export class TrackingModule {}
