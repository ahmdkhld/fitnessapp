import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { BodyLogService } from './body-log.service';

class CreateBodyLogDto {
  @IsOptional() @IsString() date?: string;
  @IsOptional() @IsNumber() weightKg?: number;
  @IsOptional() @IsNumber() waistCm?: number;
  @IsOptional() @IsNumber() bodyFatPct?: number;
  @IsOptional() @IsInt() energyLevel?: number;
  @IsOptional() @IsInt() hungerLevel?: number;
  @IsOptional() @IsInt() sleepQuality?: number;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsString() photoUrl?: string;
}

@ApiTags('body-logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('body-logs')
export class BodyLogController {
  constructor(private readonly logs: BodyLogService) {}

  @Get()
  list(
    @CurrentUser() user: AuthUser,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.logs.list(
      user.userId,
      from ? new Date(from) : undefined,
      to ? new Date(to) : undefined,
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
