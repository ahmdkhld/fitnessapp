import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { ExportService } from './export.service';
import { PdfReportService } from './pdf-report.service';

@ApiTags('export')
@ApiBearerAuth()
@Controller('export')
export class ExportController {
  constructor(
    private readonly exportService: ExportService,
    private readonly pdf: PdfReportService,
  ) {}

  @Get('report')
  report(
    @CurrentUser() user: AuthUser,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    const fromDate = from ? new Date(from) : new Date(Date.now() - 14 * 864e5);
    const toDate = to ? new Date(to) : new Date();
    return this.exportService.report(user.userId, fromDate, toDate);
  }

  @Get('report.pdf')
  async reportPdf(
    @CurrentUser() user: AuthUser,
    @Query('from') from: string,
    @Query('to') to: string,
    @Res() res: Response,
  ) {
    const fromDate = from ? new Date(from) : new Date(Date.now() - 14 * 864e5);
    const toDate = to ? new Date(to) : new Date();
    const data = await this.exportService.report(user.userId, fromDate, toDate);
    const buffer = await this.pdf.render(data as any);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="nutritrack-${fromDate.toISOString().slice(0, 10)}.pdf"`,
    );
    res.send(buffer);
  }
}
