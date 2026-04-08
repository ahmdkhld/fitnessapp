import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  USER = 'user',
  COACH = 'coach',
  ADMIN = 'admin',
}

export class SetRoleDto {
  @ApiProperty({ enum: UserRole, description: 'Role to assign to the user', example: UserRole.COACH })
  @IsEnum(UserRole)
  role!: UserRole;
}
