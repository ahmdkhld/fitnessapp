import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { NutritionService } from './nutrition.service';
import { UpsertNutritionDto } from './dto/upsert-nutrition.dto';
import { NutritionQueryDto, NutritionRangeQueryDto } from './dto/nutrition-query.dto';

@ApiTags('nutrition')
@ApiBearerAuth()
@Controller('tracking/nutrition')
export class NutritionController {
  constructor(private readonly nutrition: NutritionService) {}

  @Get()
  getByDate(@CurrentUser() user: AuthUser, @Query() query: NutritionQueryDto) {
    return this.nutrition.getByDate(user.userId, new Date(query.date));
  }

  @Get('range')
  getRange(@CurrentUser() user: AuthUser, @Query() query: NutritionRangeQueryDto) {
    return this.nutrition.getRange(
      user.userId,
      new Date(query.from),
      new Date(query.to),
    );
  }

  @Post()
  upsert(@CurrentUser() user: AuthUser, @Body() dto: UpsertNutritionDto) {
    return this.nutrition.upsert(user.userId, dto);
  }
}
