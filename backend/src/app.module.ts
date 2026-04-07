import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DietPlansModule } from './modules/diet-plans/diet-plans.module';
import { SupplementsModule } from './modules/supplements/supplements.module';
import { ScheduleModule as NtScheduleModule } from './modules/schedule/schedule.module';
import { TrackingModule } from './modules/tracking/tracking.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PlanParserModule } from './modules/plan-parser/plan-parser.module';
import { ExportModule } from './modules/export/export.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    DietPlansModule,
    SupplementsModule,
    NtScheduleModule,
    TrackingModule,
    AnalyticsModule,
    NotificationsModule,
    PlanParserModule,
    ExportModule,
  ],
})
export class AppModule {}
