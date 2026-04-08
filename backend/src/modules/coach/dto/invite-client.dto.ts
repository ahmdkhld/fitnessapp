import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InviteClientDto {
  @ApiProperty({ description: 'Email address of the client to invite', example: 'client@example.com' })
  @IsEmail()
  email!: string;
}
