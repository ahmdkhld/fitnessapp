import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { WorkoutSessionsService } from './workout-sessions.service';
import { StartSessionDto } from './dto/start-session.dto';
import { CompleteSessionDto } from './dto/complete-session.dto';
import { CreateSetDto } from './dto/create-set.dto';
import { UpdateSetDto } from './dto/update-set.dto';
import { ListSessionsQueryDto } from './dto/list-sessions-query.dto';

@ApiTags('workout-sessions')
@ApiBearerAuth()
@Controller('workout-sessions')
export class WorkoutSessionsController {
  constructor(private readonly service: WorkoutSessionsService) {}

  @Post('start')
  start(@CurrentUser() user: AuthUser, @Body() dto: StartSessionDto) {
    return this.service.start(user.userId, dto);
  }

  @Get()
  list(@CurrentUser() user: AuthUser, @Query() query: ListSessionsQueryDto) {
    return this.service.list(user.userId, {
      from: query.from ? new Date(query.from) : undefined,
      to: query.to ? new Date(query.to) : undefined,
      page: query.page ?? 1,
      limit: query.limit ?? 20,
    });
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.service.findOne(user.userId, id);
  }

  @Patch(':id/complete')
  complete(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: CompleteSessionDto,
  ) {
    return this.service.complete(user.userId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.service.remove(user.userId, id);
  }

  @Post(':id/sets')
  logSet(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: CreateSetDto,
  ) {
    return this.service.logSet(user.userId, id, dto);
  }

  @Patch('sets/:setId')
  updateSet(
    @CurrentUser() user: AuthUser,
    @Param('setId') setId: string,
    @Body() dto: UpdateSetDto,
  ) {
    return this.service.updateSet(user.userId, setId, dto);
  }

  @Delete('sets/:setId')
  removeSet(@CurrentUser() user: AuthUser, @Param('setId') setId: string) {
    return this.service.removeSet(user.userId, setId);
  }
}
