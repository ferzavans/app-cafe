export type MethodId =
  | 'v60'
  | 'moka'
  | 'espresso'
  | 'melitta'
  | 'chemex'
  | 'clever'
  | 'aeropress'
  | 'prensa'
  | 'coldbrew';

export type GrindLevel =
  | 'extra-fina'
  | 'fina'
  | 'media-fina'
  | 'media'
  | 'media-grossa'
  | 'grossa';

export const GRIND_SCALE: {
  level: GrindLevel;
  name: string;
  looksLike: string;
  microns: string;
}[] = [
  { level: 'extra-fina', name: 'Extra-fina', looksLike: 'Talco ou farinha', microns: '< 200 µm' },
  { level: 'fina', name: 'Fina', looksLike: 'Areia fina ou açúcar de confeiteiro grosso', microns: '200–400 µm' },
  { level: 'media-fina', name: 'Média-fina', looksLike: 'Sal fino', microns: '400–600 µm' },
  { level: 'media', name: 'Média', looksLike: 'Açúcar refinado / areia de praia', microns: '600–800 µm' },
  { level: 'media-grossa', name: 'Média-grossa', looksLike: 'Açúcar cristal', microns: '800–1000 µm' },
  { level: 'grossa', name: 'Grossa', looksLike: 'Sal grosso', microns: '> 1000 µm' },
];

/**
 * A step of a brewing guide. Timed steps advance on their own when the time
 * runs out; manual steps (durationSec null) wait for the user to tap.
 * `{cafe}`, `{agua}`, `{agua:0.4}`, `{bloom}` and `{bebida}` in the text are replaced by
 * amounts scaled to the chosen recipe.
 */
export type BrewStep = {
  title: string;
  text: string;
  durationSec: number | null;
};

export type Method = {
  id: MethodId;
  name: string;
  emoji: string;
  summary: string;
  grind: GrindLevel;
  grindTip: string;
  waterTempC: [number, number];
  totalTime: string;
  /** Grams of water (or drink, for espresso) per gram of coffee. */
  ratio: { default: number; min: number; max: number; label: string };
  defaultCoffeeG: number;
  /** Coffee for one person, used by the "pessoas" picker. */
  perPersonCoffeeG: number;
  /** Quick picks for the calculator, as a coffee dose. */
  sizes: { label: string; coffeeG: number }[];
  ratioPresets: { label: string; ratio: number }[];
  /** Espresso is weighed as drink in the cup; the others as water poured. */
  output: 'water' | 'drink';
  waterUnit: 'g' | 'ml';
  equipment: string[];
  tips: string[];
  steps: BrewStep[];
};

export const METHODS: Method[] = [
  {
    id: 'v60',
    name: 'V60',
    emoji: '🫖',
    summary:
      'Coado em cone (Hario V60). Xícara limpa, leve e aromática, que destaca as notas frutadas e florais do grão.',
    grind: 'media-fina',
    grindTip: 'Entre sal fino e açúcar refinado. Se a água passar rápido demais, afine; se travar, engrosse.',
    waterTempC: [92, 96],
    totalTime: '2:30 a 3:30',
    ratio: { default: 16, min: 14, max: 18, label: 'g de água por g de café' },
    defaultCoffeeG: 15,
    perPersonCoffeeG: 15,
    sizes: [
      { label: '1 xícara (≈200 ml)', coffeeG: 15 },
      { label: '2 xícaras', coffeeG: 30 },
      { label: 'Garrafa (≈500 ml)', coffeeG: 34 },
    ],
    ratioPresets: [
      { label: 'Forte 1:15', ratio: 15 },
      { label: 'Equilibrado 1:16', ratio: 16 },
      { label: 'Suave 1:17', ratio: 17 },
    ],
    output: 'water',
    waterUnit: 'g',
    equipment: ['Suporte V60 e filtro de papel', 'Chaleira (de preferência bico de ganso)', 'Balança', 'Moedor'],
    tips: [
      'Enxágue o filtro com água quente para tirar o gosto de papel e aquecer o suporte. Descarte essa água.',
      'Despeje em espiral, do centro para fora, sem jogar água direto no papel.',
      'Mexa levemente (swirl) no fim para nivelar a cama de café.',
    ],
    steps: [
      {
        title: 'Preparar',
        text: 'Aqueça a água a 92–96 °C. Enxágue o filtro, descarte a água e coloque {cafe} de café moído. Nivele e zere a balança.',
        durationSec: null,
      },
      {
        title: 'Bloom (pré-infusão)',
        text: 'Despeje cerca de {bloom} de água, molhando todo o café. Ele vai “estufar” soltando gás. Espere.',
        durationSec: 45,
      },
      {
        title: 'Primeiro despejo',
        text: 'Despeje em espiral até chegar a {agua:0.6} no total.',
        durationSec: 30,
      },
      {
        title: 'Segundo despejo',
        text: 'Continue em espiral, mais devagar, até {agua} no total. Dê uma leve girada no suporte.',
        durationSec: 30,
      },
      {
        title: 'Drenagem',
        text: 'Deixe a água terminar de passar. O ideal é acabar entre 2:30 e 3:30 no total.',
        durationSec: 75,
      },
      {
        title: 'Pronto!',
        text: 'Retire o filtro, mexa o café e sirva. Bom café! ☕',
        durationSec: null,
      },
    ],
  },
  {
    id: 'moka',
    name: 'Moka',
    emoji: '🔥',
    summary:
      'Cafeteira italiana de fogão. Café encorpado e intenso, parecido com um espresso, feito com pressão de vapor.',
    grind: 'fina',
    grindTip: 'Fina, mas um pouco mais grossa que a do espresso. Fina demais entope o filtro e amarga o café.',
    waterTempC: [70, 90],
    totalTime: '4 a 6 minutos',
    ratio: { default: 10, min: 7, max: 12, label: 'ml de água por g de café' },
    defaultCoffeeG: 15,
    perPersonCoffeeG: 6,
    sizes: [
      { label: 'Moka 1 xícara', coffeeG: 6 },
      { label: 'Moka 3 xícaras', coffeeG: 15 },
      { label: 'Moka 6 xícaras', coffeeG: 30 },
      { label: 'Moka 9 xícaras', coffeeG: 45 },
    ],
    ratioPresets: [
      { label: 'Intenso 1:8', ratio: 8 },
      { label: 'Clássico 1:10', ratio: 10 },
    ],
    output: 'water',
    waterUnit: 'ml',
    equipment: ['Cafeteira moka', 'Fogão (fogo baixo a médio)', 'Água já aquecida', 'Moedor'],
    tips: [
      'Use água já quente na base: o café fica menos tempo no fogo e não “cozinha”.',
      'Nunca compacte o café no funil. Só nivele com o dedo.',
      'A água fica sempre abaixo da válvula de segurança.',
      'Tire do fogo quando o café começar a sair claro e borbulhante.',
    ],
    steps: [
      {
        title: 'Água na base',
        text: 'Coloque {agua} de água quente na base, sem passar da válvula de segurança.',
        durationSec: null,
      },
      {
        title: 'Café no funil',
        text: 'Encha o funil com {cafe} de café moído, sem compactar. Nivele e limpe a borda.',
        durationSec: null,
      },
      {
        title: 'Montar e ir ao fogo',
        text: 'Rosqueie bem (use um pano, a base está quente). Leve ao fogo baixo a médio com a tampa aberta.',
        durationSec: 120,
      },
      {
        title: 'Extração',
        text: 'O café começa a subir. Ele deve sair devagar, cor de mel escuro. Fique de olho.',
        durationSec: 90,
      },
      {
        title: 'Tirar do fogo',
        text: 'Quando sair mais claro e com borbulhas, tire do fogo e passe a base em água fria para parar a extração.',
        durationSec: null,
      },
      {
        title: 'Pronto!',
        text: 'Mexa o café na parte de cima e sirva. Bom café! ☕',
        durationSec: null,
      },
    ],
  },
  {
    id: 'espresso',
    name: 'Espresso',
    emoji: '☕',
    summary:
      'Extraído sob alta pressão (cerca de 9 bar) na máquina. Curto, intenso e com crema. É a base de cappuccino, latte e afins.',
    grind: 'extra-fina',
    grindTip: 'Bem fina, quase talco. Ajuste pelo tempo: saiu rápido demais, afine; demorou demais, engrosse.',
    waterTempC: [90, 94],
    totalTime: '25 a 30 segundos de extração',
    ratio: { default: 2, min: 1, max: 3, label: 'g de bebida por g de café' },
    defaultCoffeeG: 18,
    perPersonCoffeeG: 18,
    sizes: [
      { label: 'Simples', coffeeG: 9 },
      { label: 'Duplo', coffeeG: 18 },
      { label: 'Triplo', coffeeG: 21 },
    ],
    ratioPresets: [
      { label: 'Ristretto 1:1,5', ratio: 1.5 },
      { label: 'Normale 1:2', ratio: 2 },
      { label: 'Lungo 1:3', ratio: 3 },
    ],
    output: 'drink',
    waterUnit: 'g',
    equipment: ['Máquina de espresso', 'Porta-filtro e tamper', 'Balança', 'Moedor para espresso'],
    tips: [
      'Ristretto ≈ 1:1,5 · Normale ≈ 1:2 · Lungo ≈ 1:3.',
      'Distribua o pó antes de compactar para evitar canais (água passando por um caminho só).',
      'Compacte reto e com força firme e constante.',
      'Faça uma pequena purga no grupo antes de encaixar o porta-filtro.',
    ],
    steps: [
      {
        title: 'Dose',
        text: 'Moa {cafe} de café direto no porta-filtro seco. Distribua e nivele.',
        durationSec: null,
      },
      {
        title: 'Compactar',
        text: 'Compacte reto, com pressão firme. Limpe a borda do porta-filtro.',
        durationSec: null,
      },
      {
        title: 'Purga e encaixe',
        text: 'Solte água do grupo por 2 segundos, encaixe o porta-filtro e posicione a xícara na balança.',
        durationSec: null,
      },
      {
        title: 'Extração',
        text: 'Inicie a extração. Pare quando chegar a cerca de {bebida} na xícara (25–30 segundos).',
        durationSec: 28,
      },
      {
        title: 'Pronto!',
        text: 'Avalie: amargo e demorado → engrosse a moagem. Ácido e rápido → afine. Bom café! ☕',
        durationSec: null,
      },
    ],
  },
  {
    id: 'melitta',
    name: 'Melitta / Coador de pano',
    emoji: '🫗',
    summary:
      'O coado do dia a dia: filtro de papel Melitta ou coador de pano. Café redondo, com bom corpo e fácil de acertar.',
    grind: 'media',
    grindTip: 'Média, como açúcar refinado. Pó fino demais entope o filtro e deixa o café amargo.',
    waterTempC: [90, 94],
    totalTime: '3 a 4 minutos',
    ratio: { default: 16, min: 14, max: 18, label: 'g de água por g de café' },
    defaultCoffeeG: 20,
    perPersonCoffeeG: 15,
    sizes: [
      { label: '1 caneca (≈240 ml)', coffeeG: 15 },
      { label: 'Garrafa 500 ml', coffeeG: 34 },
      { label: 'Garrafa 1 L', coffeeG: 66 },
    ],
    ratioPresets: [
      { label: 'Forte 1:15', ratio: 15 },
      { label: 'Equilibrado 1:16', ratio: 16 },
      { label: 'Suave 1:17', ratio: 17 },
    ],
    output: 'water',
    waterUnit: 'g',
    equipment: ['Porta-filtro Melitta 102/103 ou coador de pano', 'Filtro de papel (se for Melitta)', 'Chaleira', 'Moedor'],
    tips: [
      'Não ferva a água: desligue quando começarem as primeiras bolhas e espere 30 segundos.',
      'Coador de pano: escalde antes de usar, lave só com água (sem sabão) e guarde na geladeira num pote com água.',
      'Despeje aos poucos, sem deixar a água encher até a borda do filtro.',
    ],
    steps: [
      {
        title: 'Preparar',
        text: 'Aqueça a água a 90–94 °C. Escalde o filtro (papel ou pano) e o bule, descarte essa água e coloque {cafe} de café.',
        durationSec: null,
      },
      {
        title: 'Bloom (pré-infusão)',
        text: 'Despeje cerca de {bloom} de água só para molhar todo o pó. Espere ele “estufar”.',
        durationSec: 30,
      },
      {
        title: 'Despejos',
        text: 'Despeje aos poucos, em círculos, até completar {agua} no total. Não encha até a borda.',
        durationSec: 90,
      },
      {
        title: 'Drenagem',
        text: 'Deixe terminar de passar. Se demorar muito, da próxima vez moa um pouco mais grosso.',
        durationSec: 60,
      },
      { title: 'Pronto!', text: 'Mexa o café no bule e sirva. Bom café! ☕', durationSec: null },
    ],
  },
  {
    id: 'chemex',
    name: 'Chemex',
    emoji: '⏳',
    summary:
      'Coado de vidro com filtro grosso. Xícara super limpa, doce e delicada; ótima para servir várias pessoas.',
    grind: 'media-grossa',
    grindTip: 'Média-grossa, como açúcar cristal. O filtro da Chemex é grosso: pó fino trava a passagem.',
    waterTempC: [92, 96],
    totalTime: '4:00 a 4:30',
    ratio: { default: 16, min: 15, max: 17, label: 'g de água por g de café' },
    defaultCoffeeG: 30,
    perPersonCoffeeG: 15,
    sizes: [
      { label: '1 caneca', coffeeG: 20 },
      { label: '2 xícaras', coffeeG: 30 },
      { label: 'Chemex cheia (≈750 ml)', coffeeG: 47 },
    ],
    ratioPresets: [
      { label: 'Encorpado 1:15', ratio: 15 },
      { label: 'Clássico 1:16', ratio: 16 },
      { label: 'Delicado 1:17', ratio: 17 },
    ],
    output: 'water',
    waterUnit: 'g',
    equipment: ['Chemex e filtro Chemex', 'Chaleira bico de ganso', 'Balança', 'Moedor'],
    tips: [
      'Coloque o lado do filtro com 3 camadas virado para o bico, para não colapsar.',
      'Enxágue bem o filtro: ele é grosso e solta gosto de papel.',
      'Se o tempo passar de 5 minutos, moa mais grosso.',
    ],
    steps: [
      {
        title: 'Preparar',
        text: 'Aqueça a água a 92–96 °C. Encaixe o filtro (3 camadas no bico), enxágue, descarte a água e coloque {cafe} de café.',
        durationSec: null,
      },
      { title: 'Bloom', text: 'Despeje {bloom} de água molhando todo o café. Espere o gás sair.', durationSec: 45 },
      { title: 'Primeiro despejo', text: 'Em espiral, até {agua:0.5} no total.', durationSec: 45 },
      { title: 'Segundo despejo', text: 'Continue em espiral até {agua:0.75} no total.', durationSec: 45 },
      { title: 'Último despejo', text: 'Complete até {agua} no total.', durationSec: 30 },
      { title: 'Drenagem', text: 'Deixe a água passar. O ideal é terminar entre 4:00 e 4:30.', durationSec: 90 },
      { title: 'Pronto!', text: 'Retire o filtro, gire a Chemex para misturar e sirva. Bom café! ☕', durationSec: null },
    ],
  },
  {
    id: 'clever',
    name: 'Clever',
    emoji: '🍵',
    summary:
      'Mistura de imersão e coado: o café fica de molho e depois é filtrado. Muito fácil de repetir e com bastante corpo.',
    grind: 'media',
    grindTip: 'Média, parecida com a da Melitta. Fina demais demora para drenar.',
    waterTempC: [92, 96],
    totalTime: '3:30 a 4:00',
    ratio: { default: 16, min: 14, max: 17, label: 'g de água por g de café' },
    defaultCoffeeG: 18,
    perPersonCoffeeG: 15,
    sizes: [
      { label: '1 xícara', coffeeG: 15 },
      { label: '1 caneca', coffeeG: 20 },
      { label: 'Cheio (≈500 ml)', coffeeG: 30 },
    ],
    ratioPresets: [
      { label: 'Forte 1:15', ratio: 15 },
      { label: 'Equilibrado 1:16', ratio: 16 },
      { label: 'Suave 1:17', ratio: 17 },
    ],
    output: 'water',
    waterUnit: 'g',
    equipment: ['Clever Dripper e filtro de papel nº 4', 'Chaleira', 'Balança', 'Moedor'],
    tips: [
      'Deixe o Clever na mesa durante a infusão: a válvula só abre quando você o coloca sobre a xícara.',
      'Colocar a água antes do café ajuda a drenar mais rápido e de forma mais uniforme.',
    ],
    steps: [
      {
        title: 'Preparar',
        text: 'Aqueça a água a 92–96 °C. Enxágue o filtro com o Clever sobre uma caneca, descarte e deixe o Clever na mesa.',
        durationSec: null,
      },
      { title: 'Água e café', text: 'Despeje {agua} de água e depois coloque {cafe} de café por cima.', durationSec: 15 },
      { title: 'Infusão', text: 'Tampe e deixe em infusão.', durationSec: 105 },
      { title: 'Mexer', text: 'Mexa levemente para afundar o pó e tampe de novo.', durationSec: 15 },
      { title: 'Fim da infusão', text: 'Aguarde mais um pouco.', durationSec: 45 },
      { title: 'Drenar', text: 'Coloque o Clever sobre a xícara: a válvula abre e o café desce.', durationSec: 60 },
      { title: 'Pronto!', text: 'Sirva e aproveite. Bom café! ☕', durationSec: null },
    ],
  },
  {
    id: 'aeropress',
    name: 'AeroPress',
    emoji: '🧪',
    summary:
      'Imersão com um pouco de pressão. Rápida, portátil e versátil: vai de um café limpo e suave a um concentrado tipo espresso.',
    grind: 'media-fina',
    grindTip: 'Média-fina, como sal fino. Se ficar difícil de pressionar, engrosse um pouco.',
    waterTempC: [85, 92],
    totalTime: '1:30 a 2:00',
    ratio: { default: 15, min: 6, max: 17, label: 'g de água por g de café' },
    defaultCoffeeG: 15,
    perPersonCoffeeG: 15,
    sizes: [
      { label: '1 xícara (≈200 ml)', coffeeG: 15 },
      { label: 'Caneca grande', coffeeG: 17 },
    ],
    ratioPresets: [
      { label: 'Concentrado 1:6', ratio: 6 },
      { label: 'Invertida 1:12', ratio: 12 },
      { label: 'Padrão 1:15', ratio: 15 },
    ],
    output: 'water',
    waterUnit: 'g',
    equipment: ['AeroPress e filtro de papel', 'Caneca resistente', 'Chaleira', 'Balança', 'Moedor'],
    tips: [
      'Invertida: monte de cabeça para baixo (êmbolo embaixo), faça a infusão, tampe e vire sobre a caneca na hora de pressionar. Use 1:12.',
      'Concentrado (1:6): pressione e complete com água quente ou leite, tipo um americano ou latte.',
      'Pressione devagar (uns 30 s) e pare quando ouvir o chiado.',
    ],
    steps: [
      {
        title: 'Preparar',
        text: 'Aqueça a água a 85–92 °C. Enxágue o filtro na tampa, monte a AeroPress sobre a caneca e coloque {cafe} de café.',
        durationSec: null,
      },
      { title: 'Bloom', text: 'Despeje {bloom} de água e mexa para molhar todo o pó.', durationSec: 30 },
      { title: 'Completar', text: 'Complete com água até {agua} no total e encaixe o êmbolo só um pouco, para segurar o vácuo.', durationSec: 20 },
      { title: 'Infusão', text: 'Deixe em infusão.', durationSec: 60 },
      { title: 'Pressionar', text: 'Gire levemente e pressione devagar até ouvir o chiado.', durationSec: 30 },
      { title: 'Pronto!', text: 'Sirva puro ou complete a gosto. Bom café! ☕', durationSec: null },
    ],
  },
  {
    id: 'prensa',
    name: 'Prensa francesa',
    emoji: '🫙',
    summary:
      'Imersão total: o café fica de molho e depois é prensado. Encorpado, oleoso e cheio de sabor. Difícil de errar.',
    grind: 'grossa',
    grindTip: 'Grossa, como sal grosso. Pó fino passa pela peneira e deixa a xícara turva e amarga.',
    waterTempC: [93, 96],
    totalTime: '4 minutos + 1 de descanso',
    ratio: { default: 15, min: 12, max: 17, label: 'g de água por g de café' },
    defaultCoffeeG: 30,
    perPersonCoffeeG: 15,
    sizes: [
      { label: 'Prensa 350 ml', coffeeG: 23 },
      { label: 'Prensa 600 ml', coffeeG: 40 },
      { label: 'Prensa 1 L', coffeeG: 66 },
    ],
    ratioPresets: [
      { label: 'Forte 1:12', ratio: 12 },
      { label: 'Clássico 1:15', ratio: 15 },
      { label: 'Suave 1:17', ratio: 17 },
    ],
    output: 'water',
    waterUnit: 'g',
    equipment: ['Prensa francesa', 'Chaleira', 'Colher', 'Balança', 'Moedor'],
    tips: [
      'Aqueça a prensa com água quente antes de começar.',
      'Depois de quebrar a crosta, tire a espuma com duas colheres: o café fica mais limpo.',
      'Pressione só até encostar no café, sem forçar até o fundo. Sirva tudo logo para não continuar extraindo.',
    ],
    steps: [
      {
        title: 'Preparar',
        text: 'Aqueça a água a 93–96 °C. Escalde a prensa, descarte a água e coloque {cafe} de café moído grosso.',
        durationSec: null,
      },
      { title: 'Água', text: 'Despeje {agua} de água de uma vez, molhando todo o pó.', durationSec: 30 },
      { title: 'Infusão', text: 'Deixe em infusão sem mexer. Vai se formar uma crosta por cima.', durationSec: 210 },
      { title: 'Quebrar a crosta', text: 'Mexa a crosta com uma colher e retire a espuma que sobe.', durationSec: 30 },
      { title: 'Descanso', text: 'Encaixe a tampa sem pressionar e deixe o pó assentar.', durationSec: 60 },
      { title: 'Pressionar', text: 'Pressione devagar só até a superfície do café e sirva tudo.', durationSec: null },
      { title: 'Pronto!', text: 'Bom café! ☕', durationSec: null },
    ],
  },
  {
    id: 'coldbrew',
    name: 'Cold brew',
    emoji: '🧊',
    summary:
      'Extração a frio por muitas horas na geladeira. Café doce, suave, com pouca acidez. Perfeito gelado.',
    grind: 'grossa',
    grindTip: 'Grossa, como sal grosso. Facilita a filtragem e evita amargor nas longas horas de extração.',
    waterTempC: [4, 22],
    totalTime: '12 a 18 horas na geladeira',
    ratio: { default: 8, min: 5, max: 15, label: 'ml de água por g de café' },
    defaultCoffeeG: 60,
    perPersonCoffeeG: 15,
    sizes: [
      { label: 'Pote 500 ml', coffeeG: 60 },
      { label: 'Jarra 1 L', coffeeG: 120 },
    ],
    ratioPresets: [
      { label: 'Concentrado 1:8', ratio: 8 },
      { label: 'Pronto para beber 1:12', ratio: 12 },
    ],
    output: 'water',
    waterUnit: 'ml',
    equipment: ['Pote ou jarra com tampa', 'Filtro de papel, de pano ou peneira fina', 'Água filtrada fria', 'Moedor'],
    tips: [
      'Concentrado (1:8): sirva misturando metade café e metade água, leite ou gelo.',
      'Pronto para beber (1:12): já sai na força certa, só pôr gelo.',
      'Dura até 2 semanas na geladeira, bem fechado.',
    ],
    steps: [
      {
        title: 'Misturar',
        text: 'No pote, misture {cafe} de café moído grosso com {agua} de água fria ou em temperatura ambiente.',
        durationSec: null,
      },
      {
        title: 'Molhar tudo',
        text: 'Mexa bem para não ficar pó seco. Tampe o pote.',
        durationSec: null,
      },
      {
        title: 'Geladeira',
        text: 'Leve à geladeira por 12 a 18 horas. Quando der o tempo, volte aqui e toque em próximo.',
        durationSec: null,
      },
      {
        title: 'Coar',
        text: 'Coe com filtro de papel, pano ou peneira fina. Se precisar, coe duas vezes.',
        durationSec: null,
      },
      {
        title: 'Pronto!',
        text: 'Sirva com gelo. Se fez o concentrado, dilua meio a meio. Bom café! 🧊',
        durationSec: null,
      },
    ],
  },
];

export function getMethod(id: string | undefined): Method | undefined {
  return METHODS.find((m) => m.id === id);
}

export function grindInfo(level: GrindLevel) {
  return GRIND_SCALE.find((g) => g.level === level)!;
}
