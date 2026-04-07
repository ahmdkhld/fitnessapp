import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsInt, IsObject, IsOptional, IsString } from 'class-validator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { DailyNotesService } from './daily-notes.service';

class DailyNoteDto {
  @IsOptional() @IsString() date?: string;
  @IsOptional() @IsObject() symptoms?: any;
  @IsOptional() @IsInt() mood?: number;
  @IsOptional() @IsString() notes?: string;
}

@ApiTags('daily-notes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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
