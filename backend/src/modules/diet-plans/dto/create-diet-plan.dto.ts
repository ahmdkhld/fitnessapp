import { IsOptional, IsString } from 'class-validator';

export class CreateDietPlanDto {
  @IsString()
  name!: string;

  @IsOptional() @IsString() goal?: string;
  @IsOptional() @IsString() description?: string;
}
