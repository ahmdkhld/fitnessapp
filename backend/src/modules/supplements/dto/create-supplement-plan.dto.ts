import { IsString } from 'class-validator';

export class CreateSupplementPlanDto {
  @IsString()
  name!: string;
}
