import { Module } from '@nestjs/common';
import { PlanParserController } from './plan-parser.controller';
import { PlanParserService } from './plan-parser.service';
import { TextParser } from './parsers/text.parser';
import { PdfParser } from './parsers/pdf.parser';

@Module({
  controllers: [PlanParserController],
  providers: [PlanParserService, TextParser, PdfParser],
  exports: [PlanParserService],
})
export class PlanParserModule {}
