import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
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
import { UploadsModule } from './modules/uploads/uploads.module';
import { HealthModule } from './modules/health/health.module';
import { WorkoutsModule } from './modules/workouts/workouts.module';
import { CoachModule } from './modules/coach/coach.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 10 },
      { name: 'medium', ttl: 60_000, limit: 120 },
    ]),
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
    UploadsModule,
    HealthModule,
    WorkoutsModule,
    CoachModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
