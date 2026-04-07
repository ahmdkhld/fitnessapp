import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { WaterService } from './water.service';

class LogWaterDto {
  @IsInt()
  @Min(1)
  amountMl!: number;

  @IsOptional()
  @IsString()
  date?: string;
}

@ApiTags('water')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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
