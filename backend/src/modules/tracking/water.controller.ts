import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { WaterService } from './water.service';
import { LogWaterDto } from './dto/log-water.dto';

@ApiTags('water')
@ApiBearerAuth()
@Controller('water')
export class WaterController {
  constructor(private readonly water: WaterService) {}

  @Get()
  get(@CurrentUser() user: AuthUser, @Query('date') date?: string) {
    return this.water.getDay(user.userId, date ? new Date(date) : new Date());
  }

  @Post()
  log(@CurrentUser() user: AuthUser, @Body() dto: LogWaterDto) {
    return this.water.log(
      user.userId,
      dto.amountMl,
      dto.date ? new Date(dto.date) : undefined,
    );
  }
}
