import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { AdminService } from './admin.service';

class SetRoleDto {
  @IsString()
  @IsIn(['user', 'coach', 'admin'])
  role!: 'user' | 'coach' | 'admin';
}

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get('users')
  list(
    @CurrentUser() user: AuthUser,
    @Query('search') search?: string,
    @Query('role') role?: string,
  ) {
    return this.admin.listUsers(user.userId, { search, role });
  }

  @Patch('users/:id/role')
  setRole(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: SetRoleDto,
  ) {
    return this.admin.setRole(user.userId, id, dto.role);
  }

  @Get('stats')
  stats(@CurrentUser() user: AuthUser) {
    return this.admin.stats(user.userId);
  }
}
