import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { CoachService } from './coach.service';
import { InviteClientDto } from './dto/invite-client.dto';
import { CreateDietPlanDto } from '../diet-plans/dto/create-diet-plan.dto';
import { UpdateDietPlanDto } from '../diet-plans/dto/update-diet-plan.dto';
import { CreatePlanDto } from '../workouts/dto/create-plan.dto';
import { UpdatePlanDto } from '../workouts/dto/update-plan.dto';

@ApiTags('coach')
@ApiBearerAuth()
@Controller('coach')
export class CoachController {
  constructor(private readonly coach: CoachService) {}

  @Post('invite')
  @Roles('coach', 'admin')
  invite(@CurrentUser() user: AuthUser, @Body() dto: InviteClientDto) {
    return this.coach.inviteClient(user.userId, dto.email);
  }

  @Post('accept/:linkId')
  accept(@CurrentUser() user: AuthUser, @Param('linkId') linkId: string) {
    return this.coach.acceptInvite(user.userId, linkId);
  }

  @Get('clients')
  @Roles('coach', 'admin')
  clients(@CurrentUser() user: AuthUser) {
    return this.coach.myClients(user.userId);
  }

  @Get('coaches')
  coaches(@CurrentUser() user: AuthUser) {
    return this.coach.myCoaches(user.userId);
  }

  @Get('clients/:clientId/summary')
  @Roles('coach', 'admin')
  summary(
    @CurrentUser() user: AuthUser,
    @Param('clientId') clientId: string,
  ) {
    return this.coach.clientSummary(user.userId, clientId);
  }

  // ==================== CLIENT DIET PLANS ====================

  @Get('clients/:clientId/diet-plans')
  @Roles('coach', 'admin')
  @ApiOperation({ summary: 'List diet plans for a coached client' })
  listClientDietPlans(
    @CurrentUser() user: AuthUser,
    @Param('clientId') clientId: string,
  ) {
    return this.coach.listClientDietPlans(user.userId, clientId);
  }

  @Post('clients/:clientId/diet-plans')
  @Roles('coach', 'admin')
  @ApiOperation({ summary: 'Create a diet plan for a coached client' })
  createClientDietPlan(
    @CurrentUser() user: AuthUser,
    @Param('clientId') clientId: string,
    @Body() dto: CreateDietPlanDto,
  ) {
    return this.coach.createClientDietPlan(user.userId, clientId, dto);
  }

  @Patch('clients/:clientId/diet-plans/:planId')
  @Roles('coach', 'admin')
  @ApiOperation({ summary: 'Update a diet plan for a coached client' })
  updateClientDietPlan(
    @CurrentUser() user: AuthUser,
    @Param('clientId') clientId: string,
    @Param('planId') planId: string,
    @Body() dto: UpdateDietPlanDto,
  ) {
    return this.coach.updateClientDietPlan(user.userId, clientId, planId, dto);
  }

  @Delete('clients/:clientId/diet-plans/:planId')
  @Roles('coach', 'admin')
  @ApiOperation({ summary: 'Delete a diet plan for a coached client' })
  removeClientDietPlan(
    @CurrentUser() user: AuthUser,
    @Param('clientId') clientId: string,
    @Param('planId') planId: string,
  ) {
    return this.coach.removeClientDietPlan(user.userId, clientId, planId);
  }

  // ==================== CLIENT WORKOUT PLANS ====================

  @Get('clients/:clientId/workout-plans')
  @Roles('coach', 'admin')
  @ApiOperation({ summary: 'List workout plans for a coached client' })
  listClientWorkoutPlans(
    @CurrentUser() user: AuthUser,
    @Param('clientId') clientId: string,
  ) {
    return this.coach.listClientWorkoutPlans(user.userId, clientId);
  }

  @Post('clients/:clientId/workout-plans')
  @Roles('coach', 'admin')
  @ApiOperation({ summary: 'Create a workout plan for a coached client' })
  createClientWorkoutPlan(
    @CurrentUser() user: AuthUser,
    @Param('clientId') clientId: string,
    @Body() dto: CreatePlanDto,
  ) {
    return this.coach.createClientWorkoutPlan(user.userId, clientId, dto);
  }

  @Patch('clients/:clientId/workout-plans/:planId')
  @Roles('coach', 'admin')
  @ApiOperation({ summary: 'Update a workout plan for a coached client' })
  updateClientWorkoutPlan(
    @CurrentUser() user: AuthUser,
    @Param('clientId') clientId: string,
    @Param('planId') planId: string,
    @Body() dto: UpdatePlanDto,
  ) {
    return this.coach.updateClientWorkoutPlan(user.userId, clientId, planId, dto);
  }

  @Delete('clients/:clientId/workout-plans/:planId')
  @Roles('coach', 'admin')
  @ApiOperation({ summary: 'Delete a workout plan for a coached client' })
  removeClientWorkoutPlan(
    @CurrentUser() user: AuthUser,
    @Param('clientId') clientId: string,
    @Param('planId') planId: string,
  ) {
    return this.coach.removeClientWorkoutPlan(user.userId, clientId, planId);
  }
}
