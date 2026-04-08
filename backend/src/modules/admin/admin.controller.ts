import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { AdminService } from './admin.service';
import { SetRoleDto } from './dto/set-role.dto';
import { ListUsersQueryDto } from './dto/list-users-query.dto';

@ApiTags('admin')
@ApiBearerAuth()
@Roles('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get('users')
  list(@CurrentUser() user: AuthUser, @Query() query: ListUsersQueryDto) {
    return this.admin.listUsers(user.userId, {
      search: query.search,
      role: query.role,
      page: query.page ?? 1,
      limit: query.limit ?? 20,
    });
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
