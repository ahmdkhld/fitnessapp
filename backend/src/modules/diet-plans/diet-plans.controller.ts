import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { DietPlansService } from './diet-plans.service';
import { CreateDietPlanDto } from './dto/create-diet-plan.dto';
import { UpdateDietPlanDto } from './dto/update-diet-plan.dto';

@ApiTags('diet-plans')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('diet-plans')
export class DietPlansController {
  constructor(private readonly service: DietPlansService) {}

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.service.list(user.userId);
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateDietPlanDto) {
    return this.service.create(user.userId, dto);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.service.findOne(user.userId, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateDietPlanDto,
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
}
