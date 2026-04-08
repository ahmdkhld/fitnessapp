import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PlanParserService } from './plan-parser.service';
import { TextParser } from './parsers/text.parser';
import { PdfParser } from './parsers/pdf.parser';

describe('PlanParserService.confirm', () => {
  const makeService = (parsedData: unknown) => {
    const prisma = {
      uploadedPlan: {
        findUnique: jest.fn(async () => ({
          id: 'up1',
          userId: 'u1',
          parsedData,
        })),
        update: jest.fn(async () => ({})),
      },
      dietPlan: {
        create: jest.fn(async ({ data }: any) => ({ id: 'dp1', ...data })),
      },
      supplementPlan: {
        create: jest.fn(async ({ data }: any) => ({ id: 'sp1', ...data })),
      },
    } as any;
    const svc = new PlanParserService(prisma, new TextParser(), new PdfParser(new TextParser()));
    return { svc, prisma };
  };

  it('throws NotFound when parsedData is null', async () => {
    const { svc } = makeService(null);
    await expect(svc.confirm('u1', 'up1', 'My plan')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('throws BadRequest when parsedData is the wrong shape', async () => {
    const { svc } = makeService('not an object');
    await expect(svc.confirm('u1', 'up1', 'My plan')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('skips meals missing required fields', async () => {
    const { svc, prisma } = makeService({
      meals: [
        { name: 'Breakfast', scheduledTime: '08:00:00', ingredients: [] },
        { name: 'Bad meal' /* missing scheduledTime */ },
        null,
      ],
      supplements: [],
    });
    await svc.confirm('u1', 'up1', 'Imported');
    const created = (prisma.dietPlan.create.mock.calls[0][0] as any).data;
    expect(created.meals.create).toHaveLength(1);
    expect(created.meals.create[0].name).toBe('Breakfast');
  });

  it('creates a supplement plan only when supplements exist', async () => {
    const { svc, prisma } = makeService({
      meals: [
        { name: 'Lunch', scheduledTime: '13:00:00', ingredients: [] },
      ],
      supplements: [],
    });
    await svc.confirm('u1', 'up1', 'My plan');
    expect(prisma.supplementPlan.create).not.toHaveBeenCalled();
  });

  it('creates a supplement plan when at least one supplement is valid', async () => {
    const { svc, prisma } = makeService({
      meals: [],
      supplements: [
        { name: 'Vitamin D3', scheduledTime: '09:00:00', dosage: '5000 IU' },
        { foo: 'bar' }, // dropped
      ],
    });
    await svc.confirm('u1', 'up1', 'My plan');
    expect(prisma.supplementPlan.create).toHaveBeenCalled();
    const created = (prisma.supplementPlan.create.mock.calls[0][0] as any).data;
    expect(created.supplements.create).toHaveLength(1);
  });
});
