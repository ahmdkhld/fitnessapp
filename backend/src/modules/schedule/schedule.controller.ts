import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { ScheduleService } from './schedule.service';
import { UpdateScheduleStatusDto } from './dto/update-status.dto';

@ApiTags('schedule')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly schedule: ScheduleService) {}

  @Get()
  getDay(@CurrentUser() user: AuthUser, @Query('date') date?: string) {
    const target = date ? new Date(date) : new Date();
    return this.schedule.getDay(user.userId, target);
  }

  @Patch(':id/status')
  updateStatus(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateScheduleStatusDto,
  ) {
    return this.schedule.updateStatus(user.userId, id, dto);
  }

  @Post('generate')
  generate(@CurrentUser() user: AuthUser, @Query('date') date?: string) {
    const target = date ? new Date(date) : new Date();
    return this.schedule.generateDay(user.userId, target);
  }
}
