import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BREWS, GRINDERS, brewForMethod, formatSetting, getGrinder } from '../data/grinders.ts';

test('every grinder has a valid range for every brew', () => {
  for (const g of GRINDERS) {
    for (const b of BREWS) {
      const s = g.settings[b.id];
      if (!s) continue;
      assert.ok(s[0] <= s[1], `${g.id} ${b.id}: min > max`);
      assert.ok(s[0] >= 0, `${g.id} ${b.id}: negative`);
    }
  }
});

test('settings get coarser from espresso to cold brew', () => {
  for (const g of GRINDERS) {
    let lastMin = -Infinity;
    for (const b of BREWS) {
      const s = g.settings[b.id];
      if (!s) continue;
      assert.ok(s[0] >= lastMin, `${g.id}: ${b.id} is finer than the brew before it`);
      lastMin = s[0];
    }
  }
});

test('grinder ids are unique', () => {
  assert.equal(new Set(GRINDERS.map((g) => g.id)).size, GRINDERS.length);
});

test('formatSetting', () => {
  const m3 = getGrinder('icoffee-m3pro')!;
  assert.equal(formatSetting(m3, 'v60'), '16–20 cliques');
  assert.equal(formatSetting(getGrinder('timemore-c2')!, 'espresso'), 'Não recomendado');
  assert.equal(getGrinder('nope'), undefined);
  assert.equal(getGrinder(null), undefined);
});

test('brewForMethod maps app methods to table rows', () => {
  assert.equal(brewForMethod('v60'), 'v60');
  assert.equal(brewForMethod('moka'), 'moka');
  assert.equal(brewForMethod('espresso'), 'espresso');
  assert.equal(brewForMethod('melitta'), 'v60');
  assert.equal(brewForMethod('prensa'), 'prensa');
});

test('every app method has a row in the grinder table', async () => {
  const { METHODS } = await import('../data/methods.ts');
  for (const m of METHODS) assert.ok(brewForMethod(m.id), `${m.id} has no grinder row`);
});
