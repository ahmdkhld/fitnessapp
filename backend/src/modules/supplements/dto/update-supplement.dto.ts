import { PartialType } from '@nestjs/swagger';
import { CreateSupplementDto } from './create-supplement.dto';

export class UpdateSupplementDto extends PartialType(CreateSupplementDto) {}
