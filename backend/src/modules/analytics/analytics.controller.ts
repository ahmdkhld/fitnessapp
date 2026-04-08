import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { AnalyticsService } from './analytics.service';
import { InsightsService } from './insights.service';
import { AdherenceQueryDto } from './dto/adherence-query.dto';

@ApiTags('analytics')
@ApiBearerAuth()
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
    @Query() query: AdherenceQueryDto,
  ) {
    return this.analytics.adherence(user.userId, query.period === 'month' ? 30 : 7);
  }

  @Get('streaks')
  streak(@CurrentUser() user: AuthUser) {
    return this.analytics.streak(user.userId);
  }
}
