import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { AnalyticsService } from './analytics.service';
import { InsightsService } from './insights.service';

@ApiTags('analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly analytics: AnalyticsService,
    private readonly insights: InsightsService,
  ) {}

  @Get('insights')
  getInsights(@CurrentUser() user: AuthUser) {
    return this.insights.forUser(user.userId);
  }

  @Get('adherence')
  adherence(
    @CurrentUser() user: AuthUser,
    @Query('period') period?: 'week' | 'month',
  ) {
    return this.analytics.adherence(user.userId, period === 'month' ? 30 : 7);
  }

  @Get('streaks')
  streak(@CurrentUser() user: AuthUser) {
    return this.analytics.streak(user.userId);
  }
}
