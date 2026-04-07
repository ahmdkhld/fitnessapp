import { PartialType } from '@nestjs/swagger';
import { AddDayExerciseDto } from './add-day-exercise.dto';

export class UpdateDayExerciseDto extends PartialType(AddDayExerciseDto) {}
