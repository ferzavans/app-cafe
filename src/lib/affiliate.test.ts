import { test } from 'node:test';
import assert from 'node:assert/strict';
import { METHOD_GEAR, PROFILE_SEARCH, buyUrl } from '../data/affiliateLinks.ts';
import { METHODS } from '../data/methods.ts';
import { PROFILES } from '../data/coffees.ts';

test('buyUrl falls back to store searches', () => {
  assert.equal(buyUrl('amazon', 'nada', 'Hario V60'), 'https://www.amazon.com.br/s?k=Hario%20V60');
  assert.equal(buyUrl('mercadolivre', 'nada', 'Hario V60'), 'https://lista.mercadolivre.com.br/hario-v60');
});

test('every method and coffee type has something to search', () => {
  for (const m of METHODS) assert.ok(METHOD_GEAR[m.id], `${m.id} has no gear search`);
  for (const p of PROFILES) assert.ok(PROFILE_SEARCH[p.id], `${p.id} has no coffee search`);
});
