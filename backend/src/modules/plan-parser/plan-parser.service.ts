import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TextParser, ParsedPlan } from './parsers/text.parser';
import { PdfParser } from './parsers/pdf.parser';

@Injectable()
export class PlanParserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly textParser: TextParser,
    private readonly pdfParser: PdfParser,
  ) {}

  async uploadText(userId: string, text: string) {
    const parsed = this.textParser.parse(text);
    return this.prisma.uploadedPlan.create({
      data: {
        userId,
        fileUrl: 'inline:text',
        fileType: 'text',
        parsedData: parsed as any,
        status: 'parsed',
      },
    });
  }

  async uploadPdf(userId: string, buffer: Buffer, originalName?: string) {
    const parsed = await this.pdfParser.parse(buffer);
    return this.prisma.uploadedPlan.create({
      data: {
        userId,
        fileUrl: originalName ? `inline:pdf:${originalName}` : 'inline:pdf',
        fileType: 'pdf',
        parsedData: parsed as any,
        status: 'parsed',
      },
    });
  }

  async get(userId: string, id: string) {
    const plan = await this.prisma.uploadedPlan.findUnique({ where: { id } });
    if (!plan) throw new NotFoundException();
    if (plan.userId !== userId) throw new ForbiddenException();
    return plan;
  }

  async confirm(userId: string, id: string, targetName: string) {
    const plan = await this.get(userId, id);
    const parsed = this.coerceParsed(plan.parsedData);
    if (!parsed) throw new NotFoundException('No parsed data');

    const dietPlan = await this.prisma.dietPlan.create({
      data: {
        userId,
        name: targetName || 'Imported plan',
        description: 'Imported from upload',
        meals: {
          create: parsed.meals.map((m, idx) => ({
            name: m.name,
            scheduledTime: new Date(`1970-01-01T${m.scheduledTime}Z`),
            calories: m.calories,
            proteinG: m.proteinG,
            carbsG: m.carbsG,
            fatG: m.fatG,
            notes: m.notes,
            sortOrder: idx,
            ingredients: { create: m.ingredients.map((i, j) => ({ ...i, sortOrder: j })) },
          })),
        },
      },
      include: { meals: { include: { ingredients: true } } },
    });

    let supplementPlan = null;
    if (parsed.supplements?.length) {
      supplementPlan = await this.prisma.supplementPlan.create({
        data: {
          userId,
          name: `${targetName || 'Imported'} — supplements`,
          supplements: {
            create: parsed.supplements.map((s, idx) => ({
              name: s.name,
              dosage: s.dosage,
              scheduledTime: new Date(`1970-01-01T${s.scheduledTime}Z`),
              timingNote: s.timingNote,
              frequency: 'daily',
              frequencyDays: [],
              sortOrder: idx,
            })),
          },
        },
        include: { supplements: true },
      });
    }

    await this.prisma.uploadedPlan.update({
      where: { id },
      data: { status: 'confirmed' },
    });

    return { dietPlan, supplementPlan };
  }

  /**
   * Validates a `parsedData` JSON blob against the ParsedPlan shape and
   * normalises it. Returns null if the data is missing entirely so the
   * caller can throw a clean 404, throws on shape errors so a malformed
   * row surfaces a 400 instead of crashing the confirm with a stack
   * trace from inside Prisma.
   */
  private coerceParsed(raw: unknown): ParsedPlan | null {
    if (raw == null) return null;
    if (typeof raw !== 'object' || Array.isArray(raw)) {
      throw new BadRequestException('Parsed data is malformed');
    }
    const obj = raw as Record<string, unknown>;
    const meals = Array.isArray(obj.meals) ? obj.meals : [];
    const supplements = Array.isArray(obj.supplements) ? obj.supplements : [];
    const cleanMeals: ParsedPlan['meals'] = [];
    for (const m of meals) {
      if (!m || typeof m !== 'object') continue;
      const meal = m as Record<string, unknown>;
      if (typeof meal.name !== 'string' || typeof meal.scheduledTime !== 'string') {
        continue;
      }
      cleanMeals.push({
        name: meal.name,
        scheduledTime: meal.scheduledTime,
        ingredients: Array.isArray(meal.ingredients)
          ? (meal.ingredients as any[]).filter(
              (i) => i && typeof (i as any).name === 'string',
            )
          : [],
        calories: typeof meal.calories === 'number' ? meal.calories : undefined,
        proteinG: typeof meal.proteinG === 'number' ? meal.proteinG : undefined,
        carbsG: typeof meal.carbsG === 'number' ? meal.carbsG : undefined,
        fatG: typeof meal.fatG === 'number' ? meal.fatG : undefined,
        notes: typeof meal.notes === 'string' ? meal.notes : undefined,
      });
    }
    const cleanSupps: ParsedPlan['supplements'] = [];
    for (const s of supplements) {
      if (!s || typeof s !== 'object') continue;
      const supp = s as Record<string, unknown>;
      if (typeof supp.name !== 'string' || typeof supp.scheduledTime !== 'string') {
        continue;
      }
      cleanSupps.push({
        name: supp.name,
        scheduledTime: supp.scheduledTime,
        dosage: typeof supp.dosage === 'string' ? supp.dosage : undefined,
        timingNote: typeof supp.timingNote === 'string' ? supp.timingNote : undefined,
      });
    }
    return { meals: cleanMeals, supplements: cleanSupps };
  }
}
