import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  coffeeForWater,
  drinkFor,
  fillStepText,
  formatGrams,
  formatRatio,
  formatTime,
  parseAmount,
  parseTime,
  scaleSteps,
  tablespoonsFor,
  waterFor,
} from './calc.ts';

test('water and coffee are inverse of each other', () => {
  assert.equal(waterFor({ coffeeG: 15, ratio: 16 }), 240);
  assert.equal(coffeeForWater(240, 16), 15);
  assert.equal(coffeeForWater(240, 0), 0);
});

test('drink discounts what the grounds retain', () => {
  assert.equal(drinkFor({ coffeeG: 15, ratio: 16 }), 210);
  assert.equal(drinkFor({ coffeeG: 10, ratio: 1 }), 0);
});

test('formats amounts, ratios and times in Brazilian style', () => {
  assert.equal(formatGrams(16.66), '16,5 g');
  assert.equal(formatGrams(240.4, 'ml'), '240 ml');
  assert.equal(formatRatio(16), '1:16');
  assert.equal(formatRatio(1.5), '1:1,5');
  assert.equal(formatTime(0), '0:00');
  assert.equal(formatTime(75), '1:15');
  assert.equal(formatTime(44.2), '0:45');
});

test('fills guide step tokens with the scaled recipe', () => {
  const recipe = { coffeeG: 20, ratio: 16 };
  assert.equal(
    fillStepText('{cafe} de café, bloom {bloom}, até {agua:0.6} e depois {agua}', recipe),
    '20 g de café, bloom 40 g, até 192 g e depois 320 g',
  );
  assert.equal(fillStepText('{agua} na base', { coffeeG: 15, ratio: 10 }, 'ml'), '150 ml na base');
  assert.equal(fillStepText('cerca de {bebida}', { coffeeG: 18, ratio: 2 }), 'cerca de 36 g');
});

test('parses user input with comma decimals', () => {
  assert.equal(parseAmount('15,5'), 15.5);
  assert.equal(parseAmount(' 20 '), 20);
  assert.equal(parseAmount('abc'), 0);
  assert.equal(parseAmount('-3'), 0);
});

test('tablespoons of beans round to half a spoon', () => {
  assert.equal(tablespoonsFor(15), 3);
  assert.equal(tablespoonsFor(18), 3.5);
  assert.equal(tablespoonsFor(6), 1);
});

test('parseTime reads m:ss or plain seconds', () => {
  assert.equal(parseTime('3:15'), 195);
  assert.equal(parseTime('0:45'), 45);
  assert.equal(parseTime('90'), 90);
  assert.equal(parseTime('abc'), 0);
  assert.equal(parseTime('3:75'), 0);
});

test('scaleSteps keeps proportions and manual steps', () => {
  const steps = [
    { durationSec: null },
    { durationSec: 30 },
    { durationSec: 90 },
  ];
  const scaled = scaleSteps(steps, 240);
  assert.deepEqual(scaled.map((s) => s.durationSec), [null, 60, 180]);
  assert.equal(scaleSteps(steps, 0), steps);
  assert.equal(scaleSteps([{ durationSec: null }], 100)[0].durationSec, null);
});
