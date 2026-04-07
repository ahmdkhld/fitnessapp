import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateExerciseDto {
  @IsString() name!: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() primaryMuscle?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  secondaryMuscles?: string[];

  @IsOptional() @IsString() equipment?: string;
  @IsOptional() @IsBoolean() isUnilateral?: boolean;
  @IsOptional() @IsBoolean() isCardio?: boolean;
  @IsOptional() @IsString() instructions?: string;
}
