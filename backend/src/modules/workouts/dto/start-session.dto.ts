import { IsInt, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class StartSessionDto {
  @IsOptional() @IsUUID() workoutDayId?: string;
  @IsOptional() @IsString() date?: string;
  @IsOptional() @IsNumber() bodyweightKg?: number;
  @IsOptional() @IsInt() energyLevel?: number;
}
