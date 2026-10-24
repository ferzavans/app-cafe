import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PAIRINGS, PROFILES, ROASTS, methodsForProfile } from '../data/coffees.ts';
import { METHODS } from '../data/methods.ts';

test('every method has a coffee pairing with known ids', () => {
  const profiles = new Set(PROFILES.map((p) => p.id));
  const roasts = new Set(ROASTS.map((r) => r.id));
  for (const m of METHODS) {
    const p = PAIRINGS[m.id];
    assert.ok(p, `${m.id} has no pairing`);
    assert.ok(p.profiles.length > 0 && p.roasts.length > 0);
    for (const id of p.profiles) assert.ok(profiles.has(id), `${m.id}: unknown profile ${id}`);
    for (const id of p.roasts) assert.ok(roasts.has(id), `${m.id}: unknown roast ${id}`);
  }
});

test('every profile is recommended for at least one method', () => {
  for (const p of PROFILES) assert.ok(methodsForProfile(p.id).length > 0, `${p.id} has no method`);
});

test('methodsForProfile ranks best matches first', () => {
  const methods = methodsForProfile('frutado');
  assert.equal(PAIRINGS[methods[0]].profiles[0], 'frutado');
});
