import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { getMethod, grindInfo } from '../../data/methods';
import { brewForMethod, formatSetting } from '../../data/grinders';
import { APPROX_NOTE } from '../../components/GrinderGuide';
import { useSettings } from '../../lib/settings';
import { colors } from '../../lib/theme';
import { Button, Card, InfoRow, SectionTitle, styles as ui } from '../../components/ui';
import { GrindScale } from '../../components/GrindScale';
import { RecipeCalculator } from '../../components/RecipeCalculator';
import { MyRecipeCard } from '../../components/MyRecipeCard';
import { CoffeePairingCard } from '../../components/CoffeePairingCard';
import { BuyButtons } from '../../components/BuyButtons';
import { METHOD_GEAR } from '../../data/affiliateLinks';
import { formatTime } from '../../lib/calc';

export default function MethodScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const method = getMethod(id);
  const { grinder, savedRecipes } = useSettings();
  const saved = method ? savedRecipes[method.id] : undefined;
  // Open with the user's own recipe when they saved one.
  const [recipe, setRecipe] = useState(() => ({
    coffeeG: saved?.coffeeG ?? method?.defaultCoffeeG ?? 15,
    ratio: saved?.ratio ?? method?.ratio.default ?? 16,
  }));

  if (!method) {
    return (
      <View style={ui.screen}>
        <Text style={ui.body}>Método não encontrado.</Text>
      </View>
    );
  }

  const grind = grindInfo(method.grind);
  const brew = brewForMethod(method.id);
  const timedSec = method.steps.reduce((sum, s) => sum + (s.durationSec ?? 0), 0);

  return (
    <ScrollView contentContainerStyle={ui.screen} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: `${method.emoji} ${method.name}` }} />
      <Text style={ui.body}>{method.summary}</Text>

      <Card>
        <SectionTitle>Moagem: {grind.name}</SectionTitle>
        <GrindScale level={method.grind} />
        <Text style={ui.body}>Parece: {grind.looksLike}</Text>
        <Text style={ui.muted}>{method.grindTip}</Text>
        {grinder && brew ? (
          <Text style={ui.body}>
            ⚙️ No {grinder.name}: <Text style={{ fontWeight: '700' }}>{formatSetting(grinder, brew)}</Text>
            {grinder.confidence !== 'personalizado' && <Text style={ui.muted}> ({APPROX_NOTE.toLowerCase().replace(/\.$/, '')})</Text>}
          </Text>
        ) : null}
        <Pressable onPress={() => router.push('/moagem')}>
          <Text style={[ui.body, { color: colors.accent, fontWeight: '600' }]}>
            {grinder ? 'Trocar moedor ›' : 'Escolha seu moedor para ver os cliques ›'}
          </Text>
        </Pressable>
      </Card>

      <CoffeePairingCard methodId={method.id} methodName={method.name} />

      <Card>
        <SectionTitle>Ficha rápida</SectionTitle>
        <InfoRow
          label="Água"
          value={method.id === 'coldbrew' ? 'Fria ou ambiente' : `${method.waterTempC[0]}–${method.waterTempC[1]} °C`}
        />
        <InfoRow label="Tempo total" value={method.totalTime} />
        {timedSec > 0 && <InfoRow label="Etapas cronometradas" value={formatTime(timedSec)} />}
        <Text style={[ui.stepperLabel, { marginTop: 6 }]}>Você vai precisar</Text>
        {method.equipment.map((e) => (
          <Text key={e} style={ui.body}>
            • {e}
          </Text>
        ))}
        <BuyButtons linkKey={`metodo-${method.id}`} query={METHOD_GEAR[method.id]} label={`Onde comprar: ${method.name}`} />
      </Card>

      <RecipeCalculator method={method} coffeeG={recipe.coffeeG} ratio={recipe.ratio} onChange={setRecipe} />

      <MyRecipeCard method={method} current={recipe} onUse={setRecipe} />

      <Button
        label="▶  Começar passo a passo"
        onPress={() =>
          router.push({
            pathname: '/guia/[id]',
            params: { id: method.id, cafe: String(recipe.coffeeG), proporcao: String(recipe.ratio) },
          })
        }
      />

      <Card>
        <SectionTitle>Dicas</SectionTitle>
        {method.tips.map((t) => (
          <Text key={t} style={ui.body}>
            • {t}
          </Text>
        ))}
      </Card>
    </ScrollView>
  );
}
