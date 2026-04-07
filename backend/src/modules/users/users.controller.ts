import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpsertProfileDto } from './dto/upsert-profile.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users/me')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  me(@CurrentUser() user: AuthUser) {
    return this.users.me(user.userId);
  }

  @Patch()
  update(@CurrentUser() user: AuthUser, @Body() dto: UpdateUserDto) {
    return this.users.updateMe(user.userId, dto);
  }

  @Get('profile')
  profile(@CurrentUser() user: AuthUser) {
    return this.users.getProfile(user.userId);
  }

  @Post('profile')
  upsertProfile(@CurrentUser() user: AuthUser, @Body() dto: UpsertProfileDto) {
    return this.users.upsertProfile(user.userId, dto);
  }
}
