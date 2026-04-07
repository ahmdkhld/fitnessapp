import { Injectable } from '@nestjs/common';

export interface ParsedMeal {
  name: string;
  scheduledTime: string;
  ingredients: Array<{ name: string; quantity?: string }>;
  calories?: number;
  proteinG?: number;
  carbsG?: number;
  fatG?: number;
  notes?: string;
}

export interface ParsedSupplement {
  name: string;
  dosage?: string;
  scheduledTime: string;
  timingNote?: string;
}

export interface ParsedPlan {
  meals: ParsedMeal[];
  supplements: ParsedSupplement[];
}

/**
 * Heuristic parser for text-based diet/supplement plans.
 *
 * Recognises headings like:
 *   "Breakfast — 8:00"
 *   "Meal 2 (10:30): 40g oats, 1 scoop whey"
 *   "Vitamin D3 5000 IU — 8:30 with food"
 *
 * The goal is not perfection but a "good-enough" first pass the user then
 * reviews in the UI before confirming.
 */
@Injectable()
export class TextParser {
  private readonly mealHeadingRe =
    /^(breakfast|lunch|dinner|snack|meal\s*\d+|pre[-\s]?workout|post[-\s]?workout)\b/i;

  private readonly timeRe = /(\d{1,2}):(\d{2})(?:\s*(am|pm))?/i;

  private readonly macroRe =
    /(\d+)\s*(kcal|cal)|(\d+(?:\.\d+)?)\s*g\s*(protein|carb|fat)/gi;

  private readonly supplementHintRe =
    /\b(vitamin|magnesium|zinc|omega|creatine|whey|b12|d3|k2|iron|calcium|fish\s*oil|probiotic|collagen|glutamine|ashwagandha|melatonin)\b/i;

  parse(text: string): ParsedPlan {
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    const meals: ParsedMeal[] = [];
    const supplements: ParsedSupplement[] = [];

    let currentMeal: ParsedMeal | null = null;

    for (const line of lines) {
      if (this.mealHeadingRe.test(line)) {
        if (currentMeal) meals.push(currentMeal);
        currentMeal = {
          name: this.extractName(line),
          scheduledTime: this.extractTime(line) ?? '08:00:00',
          ingredients: [],
          ...this.extractMacros(line),
        };
        continue;
      }

      if (this.supplementHintRe.test(line) && this.timeRe.test(line)) {
        supplements.push({
          name: this.extractSupplementName(line),
          dosage: this.extractDosage(line),
          scheduledTime: this.extractTime(line) ?? '08:00:00',
          timingNote: /with food|after food/i.test(line)
            ? 'after_food'
            : /empty stomach|before food/i.test(line)
              ? 'before_food'
              : undefined,
        });
        continue;
      }

      if (currentMeal) {
        // Treat as an ingredient line
        const parts = line.split(/[,;]/).map((p) => p.trim()).filter(Boolean);
        for (const p of parts) {
          const match = /^([\d./]+\s*(?:g|kg|ml|l|oz|cup|scoop|tbsp|tsp|piece|slice)s?)\s+(.+)$/i.exec(p);
          if (match) {
            currentMeal.ingredients.push({ quantity: match[1], name: match[2] });
          } else {
            currentMeal.ingredients.push({ name: p });
          }
        }
      }
    }

    if (currentMeal) meals.push(currentMeal);

    return { meals, supplements };
  }

  private extractName(line: string): string {
    const match = this.mealHeadingRe.exec(line);
    if (!match) return line;
    return match[0]
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }

  private extractTime(line: string): string | null {
    const m = this.timeRe.exec(line);
    if (!m) return null;
    let h = parseInt(m[1], 10);
    const min = parseInt(m[2], 10);
    const ampm = m[3]?.toLowerCase();
    if (ampm === 'pm' && h < 12) h += 12;
    if (ampm === 'am' && h === 12) h = 0;
    return `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:00`;
  }

  private extractMacros(line: string): Partial<ParsedMeal> {
    const out: Partial<ParsedMeal> = {};
    let m: RegExpExecArray | null;
    this.macroRe.lastIndex = 0;
    while ((m = this.macroRe.exec(line)) !== null) {
      if (m[1]) out.calories = parseInt(m[1], 10);
      if (m[3] && m[4]) {
        const val = parseFloat(m[3]);
        const type = m[4].toLowerCase();
        if (type.startsWith('protein')) out.proteinG = val;
        else if (type.startsWith('carb')) out.carbsG = val;
        else if (type.startsWith('fat')) out.fatG = val;
      }
    }
    return out;
  }

  private extractSupplementName(line: string): string {
    // Strip time and dosage hints
    return line
      .replace(this.timeRe, '')
      .replace(/\b\d+\s*(iu|mcg|mg|g|ml)\b/gi, '')
      .replace(/\bwith food|after food|before food|empty stomach\b/gi, '')
      .replace(/[—\-:]/g, ' ')
      .trim()
      .split(/\s+/)
      .slice(0, 4)
      .join(' ');
  }

  private extractDosage(line: string): string | undefined {
    const m = /\b(\d+)\s*(iu|mcg|mg|g|ml)\b/i.exec(line);
    return m ? `${m[1]} ${m[2].toUpperCase()}` : undefined;
  }
}
