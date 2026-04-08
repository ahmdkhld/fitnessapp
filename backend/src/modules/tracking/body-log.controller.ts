import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { BodyLogService } from './body-log.service';
import { CreateBodyLogDto } from './dto/create-body-log.dto';
import { DateRangeQueryDto } from './dto/date-range-query.dto';

@ApiTags('body-logs')
@ApiBearerAuth()
@Controller('body-logs')
export class BodyLogController {
  constructor(private readonly logs: BodyLogService) {}

  @Get()
  list(@CurrentUser() user: AuthUser, @Query() query: DateRangeQueryDto) {
    return this.logs.list(
      user.userId,
      query.from ? new Date(query.from) : undefined,
      query.to ? new Date(query.to) : undefined,
    );
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateBodyLogDto) {
    return this.logs.create(user.userId, {
      ...dto,
      date: dto.date ? new Date(dto.date) : undefined,
    });
  }
}
