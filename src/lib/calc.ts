// Pure recipe math, kept free of React Native imports so it runs under node --test.

export type Recipe = {
  coffeeG: number;
  /** Grams of water (or drink, for espresso) per gram of coffee. */
  ratio: number;
};

/** Ground coffee holds back roughly twice its weight in water. */
const RETENTION_PER_G = 2;

export function round(value: number, step = 1): number {
  return Math.round(value / step) * step;
}

export function waterFor(recipe: Recipe): number {
  return recipe.coffeeG * recipe.ratio;
}

export function coffeeForWater(waterG: number, ratio: number): number {
  return ratio > 0 ? waterG / ratio : 0;
}

/** What ends up in the cup for a pour-over or moka, after the grounds keep their share. */
export function drinkFor(recipe: Recipe): number {
  return Math.max(0, waterFor(recipe) - recipe.coffeeG * RETENTION_PER_G);
}

/** A level tablespoon holds roughly 5 g of whole beans. */
export const BEANS_G_PER_TABLESPOON = 5;

/** Tablespoons of whole beans for a dose; grinding barely changes the weight. */
export function tablespoonsFor(beansG: number): number {
  return round(beansG / BEANS_G_PER_TABLESPOON, 0.5);
}

export function formatGrams(value: number, unit = 'g'): string {
  if (!Number.isFinite(value)) return `0 ${unit}`;
  const rounded = value < 20 ? round(value, 0.5) : round(value);
  return `${rounded.toLocaleString('pt-BR')} ${unit}`;
}

export function formatRatio(ratio: number): string {
  return `1:${round(ratio, 0.5).toLocaleString('pt-BR')}`;
}

export function formatTime(totalSec: number): string {
  const s = Math.max(0, Math.ceil(totalSec));
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
}

/** Replaces the {cafe}, {agua}, {agua:x}, {bloom} and {bebida} tokens of a guide step. */
export function fillStepText(text: string, recipe: Recipe, waterUnit = 'g'): string {
  const water = waterFor(recipe);
  return text
    .replace(/\{cafe\}/g, formatGrams(recipe.coffeeG))
    .replace(/\{agua:([\d.]+)\}/g, (_, f: string) => formatGrams(water * Number(f), waterUnit))
    .replace(/\{agua\}/g, formatGrams(water, waterUnit))
    .replace(/\{bloom\}/g, formatGrams(recipe.coffeeG * 2, waterUnit))
    .replace(/\{bebida\}/g, formatGrams(water));
}

/** Parses what the user typed in a numeric field, accepting a comma as decimal separator. */
export function parseAmount(input: string): number {
  const n = Number(input.replace(',', '.').trim());
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/** Parses "3:15" or "195" (seconds) into seconds; 0 when it can't. */
export function parseTime(input: string): number {
  const t = input.trim();
  const m = t.match(/^(\d{1,3}):([0-5]?\d)$/);
  if (m) return Number(m[1]) * 60 + Number(m[2]);
  const n = Number(t);
  return Number.isInteger(n) && n > 0 ? n : 0;
}

/**
 * Stretches or shrinks the timed steps so they add up to `targetSec`, keeping
 * their proportions. Manual steps stay manual.
 */
export function scaleSteps<T extends { durationSec: number | null }>(steps: T[], targetSec: number): T[] {
  const total = steps.reduce((sum, s) => sum + (s.durationSec ?? 0), 0);
  if (!total || targetSec <= 0) return steps;
  const factor = targetSec / total;
  return steps.map((s) =>
    s.durationSec == null ? s : { ...s, durationSec: Math.max(5, Math.round(s.durationSec * factor)) },
  );
}
