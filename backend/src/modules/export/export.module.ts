import { Module } from '@nestjs/common';
import { ExportController } from './export.controller';
import { ExportService } from './export.service';
import { PdfReportService } from './pdf-report.service';

@Module({
  controllers: [ExportController],
  providers: [ExportService, PdfReportService],
})
export class ExportModule {}
