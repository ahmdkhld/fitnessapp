import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { DailyNotesService } from './daily-notes.service';
import { DailyNoteDto } from './dto/daily-note.dto';

@ApiTags('daily-notes')
@ApiBearerAuth()
@Controller('daily-notes')
export class DailyNotesController {
  constructor(private readonly notes: DailyNotesService) {}

  @Get()
  get(@CurrentUser() user: AuthUser, @Query('date') date?: string) {
    return this.notes.get(user.userId, date ? new Date(date) : new Date());
  }

  @Post()
  upsert(@CurrentUser() user: AuthUser, @Body() dto: DailyNoteDto) {
    const { date, ...rest } = dto;
    return this.notes.upsert(user.userId, date ? new Date(date) : new Date(), rest);
  }
}
