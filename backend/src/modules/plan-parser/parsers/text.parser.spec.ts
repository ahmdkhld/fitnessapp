import { TextParser } from './text.parser';

describe('TextParser', () => {
  const parser = new TextParser();

  it('parses a simple meal heading with time', () => {
    const result = parser.parse('Breakfast — 8:00\n40g oats, 1 scoop whey');
    expect(result.meals).toHaveLength(1);
    expect(result.meals[0].name).toBe('Breakfast');
    expect(result.meals[0].scheduledTime).toBe('08:00:00');
    expect(result.meals[0].ingredients).toEqual([
      { quantity: '40g', name: 'oats' },
      { quantity: '1 scoop', name: 'whey' },
    ]);
  });

  it('extracts calories and macros from meal line', () => {
    const result = parser.parse('Lunch 13:00 600 kcal 40g protein 60g carb 15g fat');
    const m = result.meals[0];
    expect(m.calories).toBe(600);
    expect(m.proteinG).toBe(40);
    expect(m.carbsG).toBe(60);
    expect(m.fatG).toBe(15);
  });

  it('parses 12-hour times correctly', () => {
    expect(parser.parse('Meal 3 2:30pm').meals[0].scheduledTime).toBe('14:30:00');
    expect(parser.parse('Breakfast 7:15 am').meals[0].scheduledTime).toBe('07:15:00');
  });

  it('detects supplements with dosage and timing', () => {
    const text = 'Vitamin D3 5000 IU — 8:30 with food\nMagnesium 400 mg 22:00 empty stomach';
    const { supplements } = parser.parse(text);
    expect(supplements).toHaveLength(2);
    expect(supplements[0].dosage).toBe('5000 IU');
    expect(supplements[0].scheduledTime).toBe('08:30:00');
    expect(supplements[0].timingNote).toBe('after_food');
    expect(supplements[1].timingNote).toBe('before_food');
  });

  it('handles multiple meals in one document', () => {
    const text = `
      Breakfast 8:00
      oats, berries
      Lunch 13:00
      chicken, rice
      Dinner 19:00
      fish, broccoli
    `;
    const { meals } = parser.parse(text);
    expect(meals.map((m) => m.name)).toEqual(['Breakfast', 'Lunch', 'Dinner']);
  });
});
