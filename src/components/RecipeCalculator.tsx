import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import type { Method } from '../data/methods';
import {
  BEANS_G_PER_TABLESPOON,
  drinkFor,
  formatGrams,
  formatRatio,
  parseAmount,
  round,
  tablespoonsFor,
  waterFor,
} from '../lib/calc';
import { Card, Chip, InfoRow, SectionTitle, Stepper, styles as ui } from './ui';

type Props = {
  method: Method;
  coffeeG: number;
  ratio: number;
  onChange: (next: { coffeeG: number; ratio: number }) => void;
};

const show = (n: number) => String(round(n, n < 20 ? 0.5 : 1)).replace('.', ',');

const PEOPLE = [1, 2, 3, 4, 6];

const formatSpoons = (n: number) => `${n.toLocaleString('pt-BR')} ${n === 1 ? 'colher' : 'colheres'}`;

/**
 * Coffee/water calculator for one method. Coffee and water are edited
 * independently and the ratio follows from them; picking a size or a ratio
 * preset sets the water from the coffee.
 */
export function RecipeCalculator({ method, coffeeG, ratio, onChange }: Props) {
  const [coffeeText, setCoffeeText] = useState(show(coffeeG));
  const [waterText, setWaterText] = useState(show(coffeeG * ratio));
  const [editing, setEditing] = useState<'coffee' | 'water' | null>(null);

  // Keep the field the user is not typing in synced with the recipe.
  useEffect(() => {
    if (editing !== 'coffee') setCoffeeText(show(coffeeG));
    if (editing !== 'water') setWaterText(show(coffeeG * ratio));
  }, [coffeeG, ratio, editing]);

  const isDrink = method.output === 'drink';
  const waterLabel = isDrink ? 'Bebida na xícara' : 'Água';
  const waterStep = isDrink ? 2 : 10;

  const recipe = { coffeeG, ratio };
  const water = waterFor(recipe);
  /** A serving size: the water scales with the coffee at the current ratio. */
  const setServing = (g: number) => onChange({ coffeeG: Math.max(1, g), ratio });
  /** Only the coffee changes; the water stays put. */
  const setCoffee = (g: number) => {
    const next = Math.max(1, g);
    onChange({ coffeeG: next, ratio: water / next });
  };
  /** Only the water changes; the coffee stays put. */
  const setWater = (w: number) => onChange({ coffeeG, ratio: Math.max(1, w) / coffeeG });

  return (
    <Card>
      <SectionTitle>Calculadora</SectionTitle>
      <Text style={ui.stepperLabel}>Para quantas pessoas?</Text>
      <View style={ui.row}>
        {PEOPLE.map((n) => (
          <Chip
            key={n}
            label={`${n} ${n === 1 ? 'pessoa' : 'pessoas'}`}
            selected={Math.abs(n * method.perPersonCoffeeG - coffeeG) < 0.01}
            onPress={() => {
              setEditing(null);
              setServing(n * method.perPersonCoffeeG);
            }}
          />
        ))}
      </View>
      <Text style={ui.stepperLabel}>Ou escolha o tamanho</Text>
      <View style={ui.row}>
        {method.sizes.map((s) => (
          <Chip
            key={s.label}
            label={s.label}
            selected={Math.abs(s.coffeeG - coffeeG) < 0.01}
            onPress={() => {
              setEditing(null);
              setServing(s.coffeeG);
            }}
          />
        ))}
      </View>

      <Stepper
        label="Café moído"
        unit="g"
        value={coffeeText}
        onChangeText={(t) => {
          setEditing('coffee');
          setCoffeeText(t);
          const g = parseAmount(t);
          if (g > 0) setCoffee(g);
        }}
        onStep={(d) => {
          setEditing(null);
          setCoffee(round(coffeeG + d * (coffeeG < 10 ? 0.5 : 1), 0.5));
        }}
      />
      <Stepper
        label={waterLabel}
        unit={method.waterUnit}
        value={waterText}
        onChangeText={(t) => {
          setEditing('water');
          setWaterText(t);
          const w = parseAmount(t);
          if (w > 0) setWater(w);
        }}
        onStep={(d) => {
          setEditing(null);
          setWater(Math.max(waterStep, round(water + d * waterStep, waterStep)));
        }}
      />

      <Text style={ui.muted}>Café e {waterLabel.toLowerCase()} mudam separados: a proporção se ajusta sozinha.</Text>
      <Text style={ui.stepperLabel}>Proporção {formatRatio(ratio)}</Text>
      <View style={ui.row}>
        {method.ratioPresets.map((p) => (
          <Chip
            key={p.label}
            label={p.label}
            selected={p.ratio === ratio}
            onPress={() => {
              setEditing(null);
              onChange({ coffeeG, ratio: p.ratio });
            }}
          />
        ))}
      </View>

      <View style={{ gap: 6, marginTop: 4 }}>
        <InfoRow label="Grãos para moer" value={formatGrams(coffeeG)} />
        <InfoRow label="Em colheres de sopa" value={`≈ ${formatSpoons(tablespoonsFor(coffeeG))} de grãos`} />
        <InfoRow label={waterLabel} value={formatGrams(waterFor(recipe), method.waterUnit)} />
        {!isDrink && <InfoRow label="Café pronto (aprox.)" value={formatGrams(drinkFor(recipe), 'ml')} />}
        <Text style={ui.muted}>
          Pese os grãos antes de moer: o peso do pó é praticamente o mesmo. Sem balança, use as colheres (cerca de{' '}
          {BEANS_G_PER_TABLESPOON} g de grãos por colher de sopa rasa).
        </Text>
        {method.id === 'moka' && (
          <Text style={ui.muted}>Na moka, o certo é encher o funil sem compactar: use o valor como referência.</Text>
        )}
      </View>
    </Card>
  );
}
