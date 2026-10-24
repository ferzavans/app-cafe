import type { MethodId } from './methods';

export type ProfileId = 'frutado' | 'doce' | 'chocolate' | 'encorpado' | 'fermentado';
export type RoastId = 'clara' | 'media' | 'media-escura' | 'escura';

/** Flavor families as they show up on coffee bags. */
export const PROFILES: {
  id: ProfileId;
  name: string;
  emoji: string;
  tastes: string;
  examples: string;
  onTheBag: string;
}[] = [
  {
    id: 'frutado',
    name: 'Frutado e floral',
    emoji: '🍓',
    tastes: 'Acidez viva, notas de frutas vermelhas, cítricos, flores e chá.',
    examples: 'Etiópia, Quênia, Colômbia; no Brasil, especiais lavados da Mantiqueira e da Chapada Diamantina.',
    onTheBag: '“Lavado”, notas de frutas/flores, torra clara, pontuação acima de 85.',
  },
  {
    id: 'doce',
    name: 'Doce e equilibrado',
    emoji: '🍯',
    tastes: 'Doçura de mel e caramelo, acidez suave e redonda, fácil de gostar.',
    examples: 'Sul de Minas, Mogiana, Mantiqueira de Minas; cafés “cereja descascado” ou honey.',
    onTheBag: '“Cereja descascado”, “honey”, notas de caramelo/mel, torra média.',
  },
  {
    id: 'chocolate',
    name: 'Achocolatado e castanhas',
    emoji: '🍫',
    tastes: 'Chocolate, cacau, castanhas e nozes; pouca acidez e bom corpo.',
    examples: 'Cerrado Mineiro, Alta Mogiana, Sul de Minas naturais; muitos blends de espresso.',
    onTheBag: '“Natural”, notas de chocolate/castanha, torra média a média-escura.',
  },
  {
    id: 'encorpado',
    name: 'Encorpado e intenso',
    emoji: '💪',
    tastes: 'Bem encorpado, amargor marcante, crema farta; aguenta leite e açúcar.',
    examples: 'Blends com robusta/conilon (Rondônia, Espírito Santo), cafés tradicionais de torra escura.',
    onTheBag: '“Blend”, “robusta” ou “conilon”, “extraforte”, torra escura.',
  },
  {
    id: 'fermentado',
    name: 'Fermentado e exótico',
    emoji: '🍷',
    tastes: 'Notas intensas de frutas maduras, vinho, licor e especiarias.',
    examples: 'Naturais fermentados, anaeróbicos e microlotes especiais.',
    onTheBag: '“Fermentação anaeróbica”, “natural fermentado”, notas de vinho/licor.',
  },
];

export const ROASTS: { id: RoastId; name: string; text: string }[] = [
  { id: 'clara', name: 'Clara', text: 'Mais acidez e aroma, destaca a origem. Pede moagem um pouco mais fina e água mais quente.' },
  { id: 'media', name: 'Média', text: 'Equilíbrio entre doçura, acidez e corpo. Vai bem em quase tudo.' },
  { id: 'media-escura', name: 'Média-escura', text: 'Mais corpo e chocolate, menos acidez. Ótima para espresso e moka.' },
  { id: 'escura', name: 'Escura', text: 'Amargor e corpo intensos, pouca acidez. Use água um pouco menos quente.' },
];

/** The coffee that shines in each method, best match first. */
export const PAIRINGS: Record<MethodId, { roasts: RoastId[]; profiles: ProfileId[]; why: string }> = {
  v60: {
    roasts: ['clara', 'media'],
    profiles: ['frutado', 'doce', 'fermentado'],
    why: 'O filtro de papel deixa a xícara limpa e realça acidez e aromas: é onde cafés frutados e florais brilham.',
  },
  melitta: {
    roasts: ['media'],
    profiles: ['doce', 'chocolate'],
    why: 'Coado do dia a dia pede café redondo, doce e com corpo, fácil de acertar e de gostar.',
  },
  chemex: {
    roasts: ['clara', 'media'],
    profiles: ['frutado', 'fermentado', 'doce'],
    why: 'O filtro grosso tira quase todo o óleo: sobra uma xícara delicada que valoriza cafés especiais e aromáticos.',
  },
  clever: {
    roasts: ['media', 'clara'],
    profiles: ['doce', 'chocolate', 'frutado'],
    why: 'Imersão + papel dá doçura e corpo com xícara limpa. Perdoa erros e vai bem com quase todo café.',
  },
  aeropress: {
    roasts: ['clara', 'media'],
    profiles: ['frutado', 'doce', 'fermentado'],
    why: 'Muito versátil: na receita padrão realça frutados; no concentrado, cafés doces e achocolatados.',
  },
  prensa: {
    roasts: ['media', 'media-escura'],
    profiles: ['chocolate', 'encorpado', 'doce'],
    why: 'A peneira de metal deixa passar os óleos: destaca corpo, chocolate e castanhas.',
  },
  moka: {
    roasts: ['media-escura', 'media'],
    profiles: ['chocolate', 'encorpado'],
    why: 'Calor e pressão acentuam a acidez e o amargor: cafés achocolatados, de pouca acidez, ficam redondos.',
  },
  espresso: {
    roasts: ['media-escura', 'media'],
    profiles: ['chocolate', 'doce', 'encorpado'],
    why: 'A extração concentrada pede doçura e corpo; notas de chocolate e caramelo dão uma crema linda e combinam com leite.',
  },
  coldbrew: {
    roasts: ['media', 'media-escura'],
    profiles: ['chocolate', 'doce'],
    why: 'A água fria quase não extrai acidez: cafés achocolatados e doces ficam com gosto de achocolatado gelado.',
  },
};

export function profileInfo(id: ProfileId) {
  return PROFILES.find((p) => p.id === id)!;
}

export function roastInfo(id: RoastId) {
  return ROASTS.find((r) => r.id === id)!;
}

/** Methods where a coffee profile shines, best ranked first. */
export function methodsForProfile(id: ProfileId): MethodId[] {
  return (Object.keys(PAIRINGS) as MethodId[])
    .filter((m) => PAIRINGS[m].profiles.includes(id))
    .sort((a, b) => PAIRINGS[a].profiles.indexOf(id) - PAIRINGS[b].profiles.indexOf(id));
}
