import { IsDateString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class ListSessionsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Filter sessions from this date (ISO)' })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({ description: 'Filter sessions up to this date (ISO)' })
  @IsOptional()
  @IsDateString()
  to?: string;
}
