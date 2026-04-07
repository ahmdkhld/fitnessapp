import { Injectable, Logger } from '@nestjs/common';
import { TextParser, ParsedPlan } from './text.parser';

/**
 * Extracts text from a PDF buffer (via `pdf-parse`) and hands it to
 * the existing TextParser. Falls back to an empty parse if the PDF
 * library can't be loaded — keeps the rest of the API responsive in
 * environments without the optional dependency.
 */
@Injectable()
export class PdfParser {
  private readonly logger = new Logger(PdfParser.name);

  constructor(private readonly textParser: TextParser) {}

  async parse(buffer: Buffer): Promise<ParsedPlan> {
    try {
      // Lazy require so a missing optional dep doesn't crash bootstrap
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const pdfParse = require('pdf-parse') as (
        b: Buffer,
      ) => Promise<{ text: string }>;
      const result = await pdfParse(buffer);
      return this.textParser.parse(result.text);
    } catch (err) {
      this.logger.warn(`PDF parse failed: ${(err as Error).message}`);
      return { meals: [], supplements: [] };
    }
  }
}
