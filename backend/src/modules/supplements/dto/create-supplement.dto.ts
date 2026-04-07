import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateSupplementDto {
  @IsString() name!: string;

  @IsOptional() @IsString() dosage?: string;
  @IsOptional() @IsString() form?: string;

  /** HH:MM:SS */
  @Matches(/^\d{2}:\d{2}(:\d{2})?$/)
  scheduledTime!: string;

  @IsOptional() @IsString() timingNote?: string;
  @IsOptional() @IsString() frequency?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  frequencyDays?: number[];

  @IsOptional() @IsInt() stockQuantity?: number;
  @IsOptional() @IsInt() stockAlertAt?: number;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsInt() sortOrder?: number;
}
