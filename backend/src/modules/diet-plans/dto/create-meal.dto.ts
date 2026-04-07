import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';

export class MealIngredientDto {
  @IsString() name!: string;
  @IsOptional() @IsString() quantity?: string;
  @IsOptional() @IsInt() calories?: number;
  @IsOptional() @IsNumber() proteinG?: number;
  @IsOptional() @IsNumber() carbsG?: number;
  @IsOptional() @IsNumber() fatG?: number;
  @IsOptional() @IsInt() sortOrder?: number;
}

export class CreateMealDto {
  @IsString() name!: string;

  /** HH:MM:SS */
  @Matches(/^\d{2}:\d{2}(:\d{2})?$/)
  scheduledTime!: string;

  @IsOptional() @IsInt() calories?: number;
  @IsOptional() @IsNumber() proteinG?: number;
  @IsOptional() @IsNumber() carbsG?: number;
  @IsOptional() @IsNumber() fatG?: number;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsInt() sortOrder?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MealIngredientDto)
  ingredients?: MealIngredientDto[];
}
