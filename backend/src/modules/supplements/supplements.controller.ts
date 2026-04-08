import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { SupplementsService } from './supplements.service';
import { CreateSupplementPlanDto } from './dto/create-supplement-plan.dto';
import { CreateSupplementDto } from './dto/create-supplement.dto';
import { UpdateSupplementDto } from './dto/update-supplement.dto';

@ApiTags('supplements')
@ApiBearerAuth()
@Controller('supplement-plans')
export class SupplementsController {
  constructor(private readonly service: SupplementsService) {}

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.service.listPlans(user.userId);
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateSupplementPlanDto) {
    return this.service.createPlan(user.userId, dto);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.service.findPlan(user.userId, id);
  }

  @Delete(':id')
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.service.deletePlan(user.userId, id);
  }

  @Post(':id/activate')
  activate(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.service.activatePlan(user.userId, id);
  }

  @Post(':id/supplements')
  addSupplement(@Param('id') planId: string, @Body() dto: CreateSupplementDto) {
    return this.service.addSupplement(planId, dto);
  }

  @Patch(':id/supplements/:suppId')
  updateSupplement(
    @Param('suppId') suppId: string,
    @Body() dto: UpdateSupplementDto,
  ) {
    return this.service.updateSupplement(suppId, dto);
  }

  @Delete(':id/supplements/:suppId')
  deleteSupplement(@Param('suppId') suppId: string) {
    return this.service.removeSupplement(suppId);
  }
}
