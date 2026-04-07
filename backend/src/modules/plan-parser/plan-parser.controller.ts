import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { PlanParserService } from './plan-parser.service';

class UploadTextDto {
  @IsString() text!: string;
}

class ConfirmDto {
  @IsOptional() @IsString() name?: string;
}

@ApiTags('plan-parser')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('plan-parser')
export class PlanParserController {
  constructor(private readonly parser: PlanParserService) {}

  @Post('upload')
  upload(@CurrentUser() user: AuthUser, @Body() dto: UploadTextDto) {
    return this.parser.uploadText(user.userId, dto.text);
  }

  @Get(':id/result')
  result(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.parser.get(user.userId, id);
  }

  @Post(':id/confirm')
  confirm(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: ConfirmDto,
  ) {
    return this.parser.confirm(user.userId, id, dto.name ?? 'Imported plan');
  }
}
