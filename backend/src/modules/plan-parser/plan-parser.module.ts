import { Module } from '@nestjs/common';
import { PlanParserController } from './plan-parser.controller';
import { PlanParserService } from './plan-parser.service';
import { TextParser } from './parsers/text.parser';

@Module({
  controllers: [PlanParserController],
  providers: [PlanParserService, TextParser],
  exports: [PlanParserService],
})
export class PlanParserModule {}
