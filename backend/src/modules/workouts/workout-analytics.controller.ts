import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { WorkoutAnalyticsService } from './workout-analytics.service';

@ApiTags('workout-analytics')
@ApiBearerAuth()
@Controller('workout-analytics')
export class WorkoutAnalyticsController {
  constructor(private readonly analytics: WorkoutAnalyticsService) {}

  @Get('volume')
  volume(
    @CurrentUser() user: AuthUser,
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('groupBy') groupBy?: 'day' | 'week',
  ) {
    const fromDate = from ? new Date(from) : new Date(Date.now() - 28 * 864e5);
    const toDate = to ? new Date(to) : new Date();
    return this.analytics.volume(user.userId, fromDate, toDate, groupBy ?? 'week');
  }

  @Get('prs')
  prs(@CurrentUser() user: AuthUser) {
    return this.analytics.prs(user.userId);
  }

  @Get('exercise/:id/history')
  exerciseHistory(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
  ) {
    return this.analytics.exerciseHistory(user.userId, id);
  }

  @Get('estimated-1rm')
  estimated1rmAll(@CurrentUser() user: AuthUser) {
    return this.analytics.estimated1rmAll(user.userId);
  }
}
