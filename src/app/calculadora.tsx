import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { METHODS, type MethodId } from '../data/methods';
import { Button, Chip, styles as ui } from '../components/ui';
import { RecipeCalculator } from '../components/RecipeCalculator';

const defaults = (id: MethodId) => {
  const m = METHODS.find((x) => x.id === id)!;
  return { coffeeG: m.defaultCoffeeG, ratio: m.ratio.default };
};

export default function Calculadora() {
  const [methodId, setMethodId] = useState<MethodId>('v60');
  const [recipe, setRecipe] = useState(() => defaults('v60'));
  const method = METHODS.find((m) => m.id === methodId)!;

  return (
    <ScrollView contentContainerStyle={ui.screen} keyboardShouldPersistTaps="handled">
      <View style={ui.row}>
        {METHODS.map((m) => (
          <Chip
            key={m.id}
            label={`${m.emoji} ${m.name}`}
            selected={m.id === methodId}
            onPress={() => {
              setMethodId(m.id);
              setRecipe(defaults(m.id));
            }}
          />
        ))}
      </View>
      {/* key remounts the calculator so its text fields reset with the method */}
      <RecipeCalculator
        key={methodId}
        method={method}
        coffeeG={recipe.coffeeG}
        ratio={recipe.ratio}
        onChange={setRecipe}
      />
      <Button
        label="▶  Preparar com esta receita"
        onPress={() =>
          router.push({
            pathname: '/guia/[id]',
            params: { id: methodId, cafe: String(recipe.coffeeG), proporcao: String(recipe.ratio) },
          })
        }
      />
    </ScrollView>
  );
}
