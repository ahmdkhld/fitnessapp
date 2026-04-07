import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { PassThrough } from 'stream';

interface ReportData {
  user: { email?: string | null; fullName?: string | null; goal?: string | null } | null;
  period: { from: Date; to: Date };
  summary: { totalItems: number; completed: number; adherencePct: number };
  dailyAdherence: Array<{ date: string; total: number; completed: number; percentage: number }>;
  dailyWaterMl: Array<{ date: string; amountMl: number }>;
  bodyLogs: Array<{
    date: Date;
    weightKg: any;
    waistCm: any;
    bodyFatPct: any;
    energyLevel: number | null;
  }>;
  workouts?: {
    sessionCount: number;
    totalDurationMin: number;
    sessions: Array<{
      date: Date | string;
      name: string;
      durationMin: number | null;
      setCount: number;
      totalVolumeKg: number;
    }>;
    personalRecords: Array<{
      exercise: string;
      recordType: string;
      value: number;
      unit: string;
      achievedAt: Date | string;
    }>;
  };
}

/**
 * Renders the coach report JSON into a printable PDF using pdfkit.
 * Streams to a Buffer so the controller can send it directly.
 */
@Injectable()
export class PdfReportService {
  async render(data: ReportData): Promise<Buffer> {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const stream = new PassThrough();
    const chunks: Buffer[] = [];
    stream.on('data', (c) => chunks.push(c as Buffer));
    doc.pipe(stream);

    this.header(doc, data);
    this.summary(doc, data);
    this.adherenceTable(doc, data);
    this.bodyLogTable(doc, data);
    this.workoutSection(doc, data);

    doc.end();
    await new Promise<void>((resolve) => stream.on('end', resolve));
    return Buffer.concat(chunks);
  }

  private header(doc: PDFKit.PDFDocument, data: ReportData) {
    doc.fontSize(22).fillColor('#2e7d5c').text('NutriTrack Report', { align: 'left' });
    doc.moveDown(0.3);
    doc
      .fontSize(11)
      .fillColor('#666')
      .text(
        `${data.user?.fullName ?? data.user?.email ?? 'User'}  ·  ` +
          `${this.formatDate(data.period.from)} – ${this.formatDate(data.period.to)}`,
      );
    if (data.user?.goal) {
      doc.text(`Goal: ${data.user.goal}`);
    }
    doc.moveDown(1);
  }

  private summary(doc: PDFKit.PDFDocument, data: ReportData) {
    doc.fontSize(14).fillColor('#000').text('Summary');
    doc.moveDown(0.3);
    doc
      .fontSize(11)
      .fillColor('#333')
      .text(
        `Items scheduled: ${data.summary.totalItems}\n` +
          `Items completed: ${data.summary.completed}\n` +
          `Overall adherence: ${data.summary.adherencePct}%`,
      );
    doc.moveDown(1);
  }

  private adherenceTable(doc: PDFKit.PDFDocument, data: ReportData) {
    doc.fontSize(14).fillColor('#000').text('Daily adherence');
    doc.moveDown(0.3);
    doc.fontSize(10).fillColor('#666');

    const cols = [
      { label: 'Date', width: 110 },
      { label: 'Done', width: 70 },
      { label: 'Total', width: 70 },
      { label: '%', width: 60 },
    ];
    let x = doc.x;
    const startY = doc.y;
    let dx = x;
    for (const c of cols) {
      doc.text(c.label, dx, startY, { width: c.width });
      dx += c.width;
    }
    doc.moveDown(0.4);
    doc
      .moveTo(x, doc.y)
      .lineTo(x + cols.reduce((s, c) => s + c.width, 0), doc.y)
      .stroke('#ccc');
    doc.moveDown(0.3);

    doc.fillColor('#000');
    for (const row of data.dailyAdherence) {
      const y = doc.y;
      let dx2 = x;
      const values = [row.date, String(row.completed), String(row.total), `${row.percentage}%`];
      for (let i = 0; i < cols.length; i++) {
        doc.text(values[i], dx2, y, { width: cols[i].width });
        dx2 += cols[i].width;
      }
      doc.moveDown(0.2);
    }
    doc.moveDown(1);
  }

  private bodyLogTable(doc: PDFKit.PDFDocument, data: ReportData) {
    if (data.bodyLogs.length === 0) return;
    doc.fontSize(14).fillColor('#000').text('Body log');
    doc.moveDown(0.3);
    doc.fontSize(10).fillColor('#333');
    for (const log of data.bodyLogs) {
      const parts: string[] = [this.formatDate(log.date)];
      if (log.weightKg != null) parts.push(`${log.weightKg} kg`);
      if (log.waistCm != null) parts.push(`waist ${log.waistCm} cm`);
      if (log.bodyFatPct != null) parts.push(`bf ${log.bodyFatPct}%`);
      if (log.energyLevel != null) parts.push(`energy ${log.energyLevel}/5`);
      doc.text(parts.join('  ·  '));
    }
  }

  private workoutSection(doc: PDFKit.PDFDocument, data: ReportData) {
    const w = data.workouts;
    if (!w || w.sessionCount === 0) return;
    doc.addPage();
    doc.fontSize(18).fillColor('#2e7d5c').text('Workouts');
    doc.moveDown(0.5);
    doc
      .fontSize(11)
      .fillColor('#333')
      .text(
        `${w.sessionCount} session${w.sessionCount === 1 ? '' : 's'}  ·  ` +
          `${w.totalDurationMin} total minutes`,
      );
    doc.moveDown(1);

    if (w.sessions.length > 0) {
      doc.fontSize(14).fillColor('#000').text('Sessions');
      doc.moveDown(0.3);
      doc.fontSize(10).fillColor('#333');
      for (const s of w.sessions) {
        doc.text(
          `${this.formatDate(s.date)}  ·  ${s.name}  ·  ` +
            `${s.setCount} sets  ·  ${Math.round(s.totalVolumeKg)} kg volume  ·  ` +
            `${s.durationMin ?? 0} min`,
        );
      }
      doc.moveDown(1);
    }

    if (w.personalRecords.length > 0) {
      doc.fontSize(14).fillColor('#000').text('Personal records');
      doc.moveDown(0.3);
      doc.fontSize(10).fillColor('#333');
      for (const pr of w.personalRecords) {
        doc.text(
          `${this.formatDate(pr.achievedAt)}  ·  ${pr.exercise}  ·  ` +
            `${pr.recordType.replace(/_/g, ' ')}: ${pr.value} ${pr.unit}`,
        );
      }
      doc.moveDown(1);
    }
  }

  private formatDate(d: Date | string): string {
    const date = typeof d === 'string' ? new Date(d) : d;
    return date.toISOString().slice(0, 10);
  }
}
