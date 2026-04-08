import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { WorkoutPlansService } from './workout-plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { CreateDayDto } from './dto/create-day.dto';
import { AddDayExerciseDto } from './dto/add-day-exercise.dto';
import { UpdateDayExerciseDto } from './dto/update-day-exercise.dto';

@ApiTags('workout-plans')
@ApiBearerAuth()
@Controller('workout-plans')
export class WorkoutPlansController {
  constructor(private readonly service: WorkoutPlansService) {}

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.service.list(user.userId);
  }

  @Get('templates')
  listTemplates() {
    return this.service.listTemplates();
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreatePlanDto) {
    return this.service.create(user.userId, dto);
  }

  @Post('templates/:id/clone')
  clone(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.service.cloneTemplate(user.userId, id);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.service.findOne(user.userId, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdatePlanDto,
  ) {
    return this.service.update(user.userId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.service.remove(user.userId, id);
  }

  @Post(':id/activate')
  activate(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.service.activate(user.userId, id);
  }

  // ----- DAYS -----

  @Post(':id/days')
  addDay(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: CreateDayDto,
  ) {
    return this.service.addDay(user.userId, id, dto);
  }

  @Patch('days/:dayId')
  updateDay(
    @CurrentUser() user: AuthUser,
    @Param('dayId') dayId: string,
    @Body() dto: CreateDayDto,
  ) {
    return this.service.updateDay(user.userId, dayId, dto);
  }

  @Delete('days/:dayId')
  removeDay(@CurrentUser() user: AuthUser, @Param('dayId') dayId: string) {
    return this.service.removeDay(user.userId, dayId);
  }

  // ----- DAY EXERCISES -----

  @Post('days/:dayId/exercises')
  addDayExercise(
    @CurrentUser() user: AuthUser,
    @Param('dayId') dayId: string,
    @Body() dto: AddDayExerciseDto,
  ) {
    return this.service.addDayExercise(user.userId, dayId, dto);
  }

  @Patch('day-exercises/:rowId')
  updateDayExercise(
    @CurrentUser() user: AuthUser,
    @Param('rowId') rowId: string,
    @Body() dto: UpdateDayExerciseDto,
  ) {
    return this.service.updateDayExercise(user.userId, rowId, dto);
  }

  @Delete('day-exercises/:rowId')
  removeDayExercise(
    @CurrentUser() user: AuthUser,
    @Param('rowId') rowId: string,
  ) {
    return this.service.removeDayExercise(user.userId, rowId);
  }
}
