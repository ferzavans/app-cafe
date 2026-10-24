import type { GrindLevel, MethodId } from './methods';

export type BrewId = 'espresso' | 'moka' | 'aeropress' | 'v60' | 'chemex' | 'prensa' | 'coldbrew';

/** Brew types listed in the grinder table, from finest to coarsest. */
export const BREWS: { id: BrewId; name: string; emoji: string; grind: GrindLevel; methodIds: MethodId[] }[] = [
  { id: 'espresso', name: 'Espresso', emoji: '☕', grind: 'extra-fina', methodIds: ['espresso'] },
  { id: 'moka', name: 'Moka', emoji: '🔥', grind: 'fina', methodIds: ['moka'] },
  { id: 'aeropress', name: 'AeroPress', emoji: '🧪', grind: 'media-fina', methodIds: ['aeropress'] },
  { id: 'v60', name: 'V60 / Melitta / Clever', emoji: '🫖', grind: 'media-fina', methodIds: ['v60', 'melitta', 'clever'] },
  { id: 'chemex', name: 'Chemex', emoji: '⏳', grind: 'media-grossa', methodIds: ['chemex'] },
  { id: 'prensa', name: 'Prensa francesa', emoji: '🫙', grind: 'grossa', methodIds: ['prensa'] },
  { id: 'coldbrew', name: 'Cold brew', emoji: '🧊', grind: 'grossa', methodIds: ['coldbrew'] },
];

/** A [min, max] setting, or null when the grinder can't do that brew well. */
export type Setting = [number, number] | null;

export type Grinder = {
  id: string;
  brand: string;
  name: string;
  kind: 'manual' | 'eletrico';
  unit: { one: string; many: string };
  /**
   * 'referencia': based on the maker's or a published chart.
   * 'estimativa': no official chart found; a starting point to adjust by taste.
   * 'personalizado': clicks the user saved.
   */
  confidence: 'referencia' | 'estimativa' | 'personalizado';
  zeroHowTo: string;
  tips: string[];
  settings: Record<BrewId, Setting>;
};

const MANUAL_ZERO =
  'Com o moedor vazio, gire o regulador no sentido horário até travar, sem forçar: esse é o zero (mós encostadas). ' +
  'A partir dali, gire no sentido anti-horário contando os cliques.';

const CLICKS = { one: 'clique', many: 'cliques' };

export const GRINDERS: Grinder[] = [
  {
    id: 'icoffee-m3pro',
    brand: 'iCoffee',
    name: 'iCoffee M3 Pro',
    kind: 'manual',
    unit: CLICKS,
    confidence: 'referencia',
    zeroHowTo: MANUAL_ZERO,
    tips: ['Uma volta completa do regulador tem 12 cliques.', 'Espresso, coado e prensa seguem as faixas do fabricante.'],
    settings: {
      espresso: [6, 10],
      moka: [10, 14],
      aeropress: [13, 17],
      v60: [16, 20],
      chemex: [20, 24],
      prensa: [24, 30],
      coldbrew: [28, 32],
    },
  },
  {
    id: 'icoffee-portatil',
    brand: 'iCoffee',
    name: 'iCoffee portátil',
    kind: 'manual',
    unit: CLICKS,
    confidence: 'estimativa',
    zeroHowTo: MANUAL_ZERO,
    tips: [
      'Moka e V60 foram testados na prática (moka ficou ótima em 22 cliques).',
      'Os outros preparos foram calculados a partir desses dois: confira provando.',
    ],
    settings: {
      espresso: [12, 17],
      moka: [20, 25],
      aeropress: [30, 35],
      v60: [35, 40],
      chemex: [40, 45],
      prensa: [45, 52],
      coldbrew: [50, 56],
    },
  },
  {
    id: 'icoffee-edge',
    brand: 'iCoffee',
    name: 'iCoffee Edge',
    kind: 'eletrico',
    unit: { one: 'posição', many: 'posições' },
    confidence: 'estimativa',
    zeroHowTo:
      'Use o número do dial. Ajuste sempre com o motor ligado (ou vazio) para não travar as mós com grãos dentro.',
    tips: ['Depois de mudar a regulagem, descarte 1 a 2 g para tirar o pó antigo que ficou no moedor.'],
    settings: {
      espresso: [8, 16],
      moka: [16, 24],
      aeropress: [24, 32],
      v60: [30, 40],
      chemex: [38, 46],
      prensa: [44, 54],
      coldbrew: [50, 60],
    },
  },
  {
    id: 'starseeker-edge-plus',
    brand: 'Starseeker',
    name: 'Starseeker Edge Plus',
    kind: 'eletrico',
    unit: { one: 'posição', many: 'posições' },
    confidence: 'estimativa',
    zeroHowTo:
      'O dial vai de 1 a 60 (ajuste contínuo, 0,01 mm por marca). Ajuste com o motor ligado ou vazio, nunca com grãos parados dentro.',
    tips: [
      'Mós cônicas de 63 mm: vai do espresso à prensa francesa.',
      'Depois de mudar a regulagem, descarte 1 a 2 g para tirar o pó antigo.',
    ],
    settings: {
      espresso: [8, 16],
      moka: [16, 24],
      aeropress: [24, 32],
      v60: [30, 40],
      chemex: [38, 46],
      prensa: [44, 54],
      coldbrew: [50, 60],
    },
  },
  {
    id: 'timemore-c2',
    brand: 'Timemore',
    name: 'Timemore Chestnut C2',
    kind: 'manual',
    unit: CLICKS,
    confidence: 'estimativa',
    zeroHowTo: MANUAL_ZERO,
    tips: ['O C2 foi feito para coados; para espresso de verdade ele não chega fino o bastante.'],
    settings: {
      espresso: null,
      moka: [10, 13],
      aeropress: [12, 16],
      v60: [15, 20],
      chemex: [19, 23],
      prensa: [22, 26],
      coldbrew: [25, 30],
    },
  },
  {
    id: 'timemore-c3',
    brand: 'Timemore',
    name: 'Timemore Chestnut C3 / C3S',
    kind: 'manual',
    unit: CLICKS,
    confidence: 'referencia',
    zeroHowTo: MANUAL_ZERO,
    tips: ['Evite usar abaixo de 6 cliques: desgasta as mós.', 'Teste de referência: espresso em 8,5 cliques e coado em 18.'],
    settings: {
      espresso: [6, 10],
      moka: [10, 14],
      aeropress: [11, 16],
      v60: [14, 18],
      chemex: [17, 21],
      prensa: [19, 25],
      coldbrew: [23, 28],
    },
  },
  {
    id: 'hario-skerton-pro',
    brand: 'Hario',
    name: 'Hario Skerton Pro',
    kind: 'manual',
    unit: CLICKS,
    confidence: 'referencia',
    zeroHowTo: MANUAL_ZERO,
    tips: ['Cada clique muda bastante a moagem: ajuste de 1 em 1.'],
    settings: {
      espresso: [1, 2],
      moka: [3, 4],
      aeropress: [4, 5],
      v60: [5, 7],
      chemex: [7, 8],
      prensa: [9, 11],
      coldbrew: [11, 13],
    },
  },
  {
    id: 'hario-slim',
    brand: 'Hario',
    name: 'Hario Mini Mill Slim / Slim+',
    kind: 'manual',
    unit: CLICKS,
    confidence: 'estimativa',
    zeroHowTo:
      'Tire a manivela e a porca, gire a roda de ajuste no sentido horário até travar: esse é o zero. Conte os cliques no sentido anti-horário.',
    tips: ['Moagens grossas podem sair irregulares: para prensa, peneire o pó bem fino se o café ficar turvo.'],
    settings: {
      espresso: [1, 2],
      moka: [2, 4],
      aeropress: [4, 6],
      v60: [6, 9],
      chemex: [8, 10],
      prensa: [11, 14],
      coldbrew: [13, 16],
    },
  },
];

export const CUSTOM_GRINDER_ID = 'custom';

/** Clicks the user saved for their own grinder, one number per brew. */
export type CustomClicks = Partial<Record<BrewId, number>>;

export function customGrinder(clicks: CustomClicks): Grinder {
  const settings = {} as Record<BrewId, Setting>;
  for (const b of BREWS) {
    const n = clicks[b.id];
    settings[b.id] = n == null ? null : [n, n];
  }
  return {
    id: CUSTOM_GRINDER_ID,
    brand: 'Meu',
    name: 'Meu moedor',
    kind: 'manual',
    unit: CLICKS,
    confidence: 'personalizado',
    zeroHowTo: MANUAL_ZERO,
    tips: ['Anote aqui os cliques que funcionaram para você em cada método.'],
    settings,
  };
}

export function getGrinder(id: string | null | undefined): Grinder | undefined {
  return GRINDERS.find((g) => g.id === id);
}

/** "16–20 cliques", "1 clique" or a note when the grinder can't do the brew. */
export function formatSetting(grinder: Grinder, brew: BrewId): string {
  const s = grinder.settings[brew];
  if (!s) return grinder.confidence === 'personalizado' ? 'Não anotado' : 'Não recomendado';
  const [min, max] = s;
  const unit = max === 1 ? grinder.unit.one : grinder.unit.many;
  return min === max ? `${min} ${unit}` : `${min}–${max} ${unit}`;
}

export function brewForMethod(methodId: MethodId): BrewId | undefined {
  return BREWS.find((b) => b.methodIds.includes(methodId))?.id;
}
