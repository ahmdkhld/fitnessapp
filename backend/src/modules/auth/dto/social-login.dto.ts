import { IsOptional, IsString } from 'class-validator';

export class SocialLoginDto {
  @IsString()
  idToken!: string;

  @IsOptional()
  @IsString()
  fullName?: string;
}
