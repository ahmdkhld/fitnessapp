import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpsertProfileDto } from './dto/upsert-profile.dto';

class UpdateGoalDto {
  @IsString()
  goal!: string;
}

@ApiTags('users')
@ApiBearerAuth()
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

  @Patch('goal')
  updateGoal(@CurrentUser() user: AuthUser, @Body() dto: UpdateGoalDto) {
    return this.users.updateMe(user.userId, { goal: dto.goal });
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
