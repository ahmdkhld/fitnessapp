import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MealsService } from './meals.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';

@ApiTags('meals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('diet-plans/:planId/meals')
export class MealsController {
  constructor(private readonly meals: MealsService) {}

  @Get()
  list(@Param('planId') planId: string) {
    return this.meals.list(planId);
  }

  @Post()
  create(@Param('planId') planId: string, @Body() dto: CreateMealDto) {
    return this.meals.create(planId, dto);
  }

  @Patch(':mealId')
  update(@Param('mealId') mealId: string, @Body() dto: UpdateMealDto) {
    return this.meals.update(mealId, dto);
  }

  @Delete(':mealId')
  remove(@Param('mealId') mealId: string) {
    return this.meals.remove(mealId);
  }
}
