import { useState, type ReactNode } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import type { Method } from '../data/methods';
import { formatGrams, formatRatio, formatTime, parseTime, waterFor, type Recipe } from '../lib/calc';
import { useSettings } from '../lib/settings';
import { colors, spacing } from '../lib/theme';
import { Button, Card, InfoRow, SectionTitle, styles as ui } from './ui';
import { ShareRecipe } from './ShareRecipe';

type Props = {
  method: Method;
  /** What the calculator shows right now; saved as the coffee and water. */
  current: Recipe;
  onUse: (recipe: Recipe) => void;
};

/** The user's favorite recipe for a method: save, load, brew or delete it. */
export function MyRecipeCard({ method, current, onUse }: Props) {
  const { savedRecipes, saveRecipe, grinder } = useSettings();
  const saved = savedRecipes[method.id];
  const defaultTimeSec = method.steps.reduce((sum, s) => sum + (s.durationSec ?? 0), 0);
  const [editing, setEditing] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [clicks, setClicks] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  const unit = grinder?.kind === 'eletrico' ? 'posição' : 'cliques';

  const startEditing = () => {
    setClicks(saved?.clicks != null ? String(saved.clicks) : '');
    setTime(saved?.timeSec ? formatTime(saved.timeSec) : '');
    setNotes(saved?.notes ?? '');
    setEditing(true);
  };

  const save = () => {
    const n = parseInt(clicks, 10);
    const t = parseTime(time);
    saveRecipe(method.id, {
      coffeeG: current.coffeeG,
      ratio: current.ratio,
      clicks: Number.isFinite(n) && n >= 0 ? n : undefined,
      timeSec: t > 0 ? t : undefined,
      notes: notes.trim() || undefined,
    });
    setEditing(false);
  };

  if (editing) {
    return (
      <Card style={styles.card}>
        <SectionTitle>⭐ Salvar minha receita</SectionTitle>
        <Text style={ui.muted}>
          Café e {method.output === 'drink' ? 'bebida' : 'água'} vêm da calculadora acima:{' '}
          {formatGrams(current.coffeeG)} · {formatGrams(waterFor(current), method.waterUnit)} ·{' '}
          {formatRatio(current.ratio)}. Ajuste lá antes de salvar, se precisar.
        </Text>
        <Field label={`Moagem (${unit} no seu moedor)`}>
          <TextInput
            value={clicks}
            onChangeText={setClicks}
            keyboardType="number-pad"
            placeholder="ex: 22"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />
        </Field>
        {defaultTimeSec > 0 && (
          <Field label={`Tempo total das etapas (padrão ${formatTime(defaultTimeSec)})`}>
            <TextInput
              value={time}
              onChangeText={setTime}
              keyboardType="numbers-and-punctuation"
              placeholder={`ex: ${formatTime(defaultTimeSec)}`}
              placeholderTextColor={colors.muted}
              style={styles.input}
            />
          </Field>
        )}
        <Field label="Anotações (grão, torra, o que achou...)">
          <TextInput
            value={notes}
            onChangeText={setNotes}
            multiline
            placeholder="ex: café do sul de Minas, torra média, ficou doce"
            placeholderTextColor={colors.muted}
            style={[styles.input, styles.notes]}
          />
        </Field>
        <View style={ui.row}>
          <Button label="Cancelar" variant="secondary" onPress={() => setEditing(false)} />
          <Button label="Salvar" onPress={save} />
        </View>
      </Card>
    );
  }

  if (!saved) {
    return (
      <Card style={styles.card}>
        <SectionTitle>⭐ Minha receita</SectionTitle>
        <Text style={ui.body}>
          Acertou o ponto? Salve a sua versão favorita, com café, água, moagem e tempo, para usar sempre.
        </Text>
        <Button label="Salvar receita atual" onPress={startEditing} />
      </Card>
    );
  }

  const savedRecipe = { coffeeG: saved.coffeeG, ratio: saved.ratio };
  return (
    <Card style={styles.card}>
      <SectionTitle>⭐ Minha receita</SectionTitle>
      <InfoRow label="Café" value={formatGrams(saved.coffeeG)} />
      <InfoRow
        label={method.output === 'drink' ? 'Bebida' : 'Água'}
        value={formatGrams(waterFor(savedRecipe), method.waterUnit)}
      />
      <InfoRow label="Proporção" value={formatRatio(saved.ratio)} />
      {saved.clicks != null && <InfoRow label="Moagem" value={`${saved.clicks} ${unit}`} />}
      {saved.timeSec != null && <InfoRow label="Tempo total" value={formatTime(saved.timeSec)} />}
      {saved.notes && <Text style={[ui.muted, { fontStyle: 'italic' }]}>“{saved.notes}”</Text>}
      <Button
        label="▶  Preparar a minha receita"
        onPress={() =>
          router.push({
            pathname: '/guia/[id]',
            params: {
              id: method.id,
              cafe: String(saved.coffeeG),
              proporcao: String(saved.ratio),
              ...(saved.timeSec ? { tempo: String(saved.timeSec) } : {}),
            },
          })
        }
      />
      <Button label="📤  Compartilhar minha receita" variant="secondary" onPress={() => setSharing(true)} />
      {sharing && <ShareRecipe method={method} recipe={saved} onClose={() => setSharing(false)} />}
      <View style={ui.row}>
        <Button label="Usar na calculadora" variant="secondary" onPress={() => onUse(savedRecipe)} />
        <Button label="Editar" variant="secondary" onPress={startEditing} />
      </View>
      <Text
        style={styles.delete}
        onPress={() =>
          Alert.alert('Apagar minha receita?', 'Você pode salvar outra quando quiser.', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Apagar', style: 'destructive', onPress: () => saveRecipe(method.id, null) },
          ])
        }
      >
        Apagar minha receita
      </Text>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={{ gap: spacing.xs }}>
      <Text style={ui.stepperLabel}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 2, borderColor: colors.accent },
  input: {
    fontSize: 17,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.background,
  },
  notes: { minHeight: 70, textAlignVertical: 'top' },
  delete: { color: '#A33B2B', textAlign: 'center', fontWeight: '600', paddingVertical: 6 },
});
