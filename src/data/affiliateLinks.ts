import type { ProfileId } from './coffees';
import type { MethodId } from './methods';

/*
 * ============================================================
 *  LINKS DE AFILIADO: edite só este arquivo
 * ============================================================
 *
 * 1. Amazon Associados: cole sua "tag" (ex: 'seunome-20') em AMAZON_TAG.
 *    Todos os botões da Amazon passam a levar sua tag automaticamente.
 *
 * 2. Mercado Livre (ou um produto específico da Amazon): cole o link de
 *    afiliado gerado no painel em CUSTOM_LINKS, na chave do item.
 *    Ex: 'timemore-c3': { mercadolivre: 'https://mercadolivre.com/sec/xxxx' }
 *
 * Enquanto um item não tiver link próprio, o botão abre uma busca na loja.
 */
export const AMAZON_TAG = '';

export type Store = 'amazon' | 'mercadolivre';

export const CUSTOM_LINKS: Record<string, Partial<Record<Store, string>>> = {
  // 'icoffee-m3pro': { amazon: 'https://amzn.to/xxxx', mercadolivre: 'https://mercadolivre.com/sec/xxxx' },
};

/** What to search for each method's main gear. Keys: `metodo-<id>`. */
export const METHOD_GEAR: Record<MethodId, string> = {
  v60: 'Hario V60 suporte',
  melitta: 'porta filtro Melitta 102',
  chemex: 'Chemex cafeteira',
  clever: 'Clever Dripper',
  aeropress: 'AeroPress cafeteira',
  prensa: 'prensa francesa café',
  moka: 'cafeteira italiana moka',
  espresso: 'máquina de espresso',
  coldbrew: 'cafeteira cold brew',
};

/** What to search for each coffee type. Keys: `cafe-<id>`. */
export const PROFILE_SEARCH: Record<ProfileId, string> = {
  frutado: 'café especial em grãos frutado torra clara',
  doce: 'café especial em grãos cereja descascado',
  chocolate: 'café especial em grãos natural chocolate',
  encorpado: 'café em grãos torra escura extraforte',
  fermentado: 'café especial fermentado anaeróbico grãos',
};

export const STORE_NAMES: Record<Store, string> = { amazon: 'Amazon', mercadolivre: 'Mercado Livre' };

/** The link for one store: the custom affiliate link if set, otherwise a store search. */
export function buyUrl(store: Store, key: string, query: string): string {
  const custom = CUSTOM_LINKS[key]?.[store];
  if (custom) return custom;
  const q = encodeURIComponent(query);
  if (store === 'amazon') return `https://www.amazon.com.br/s?k=${q}${AMAZON_TAG ? `&tag=${AMAZON_TAG}` : ''}`;
  return `https://lista.mercadolivre.com.br/${query.trim().toLowerCase().replace(/\s+/g, '-')}`;
}
