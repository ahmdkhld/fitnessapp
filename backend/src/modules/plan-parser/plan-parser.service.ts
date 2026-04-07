import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TextParser, ParsedPlan } from './parsers/text.parser';

@Injectable()
export class PlanParserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly textParser: TextParser,
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

  async get(userId: string, id: string) {
    const plan = await this.prisma.uploadedPlan.findUnique({ where: { id } });
    if (!plan) throw new NotFoundException();
    if (plan.userId !== userId) throw new ForbiddenException();
    return plan;
  }

  async confirm(userId: string, id: string, targetName: string) {
    const plan = await this.get(userId, id);
    const parsed = plan.parsedData as unknown as ParsedPlan;
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
}
