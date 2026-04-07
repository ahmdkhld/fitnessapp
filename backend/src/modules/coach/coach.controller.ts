import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { CoachService } from './coach.service';

class InviteClientDto {
  @IsEmail()
  email!: string;
}

@ApiTags('coach')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('coach')
export class CoachController {
  constructor(private readonly coach: CoachService) {}

  @Post('invite')
  invite(@CurrentUser() user: AuthUser, @Body() dto: InviteClientDto) {
    return this.coach.inviteClient(user.userId, dto.email);
  }

  @Post('accept/:linkId')
  accept(@CurrentUser() user: AuthUser, @Param('linkId') linkId: string) {
    return this.coach.acceptInvite(user.userId, linkId);
  }

  @Get('clients')
  clients(@CurrentUser() user: AuthUser) {
    return this.coach.myClients(user.userId);
  }

  @Get('coaches')
  coaches(@CurrentUser() user: AuthUser) {
    return this.coach.myCoaches(user.userId);
  }

  @Get('clients/:clientId/summary')
  summary(
    @CurrentUser() user: AuthUser,
    @Param('clientId') clientId: string,
  ) {
    return this.coach.clientSummary(user.userId, clientId);
  }
}
