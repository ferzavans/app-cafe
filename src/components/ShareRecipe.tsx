import { useRef, useState, type ComponentRef } from 'react';
import { Modal, Platform, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import type { Method } from '../data/methods';
import { formatGrams, formatRatio, formatTime, waterFor } from '../lib/calc';
import type { SavedRecipe } from '../lib/settings';
import { useSettings } from '../lib/settings';
import { colors, radius, spacing } from '../lib/theme';
import { CoffeeScene } from './CoffeeScene';
import { Button } from './ui';

const APP_NAME = 'Café Guia';

/** Shows the saved recipe as a pretty card and shares it as an image (text where images can't be shared). */
export function ShareRecipe({ method, recipe, onClose }: { method: Method; recipe: SavedRecipe; onClose: () => void }) {
  const { grinder } = useSettings();
  const cardRef = useRef<ComponentRef<typeof View>>(null);
  const [busy, setBusy] = useState(false);

  const water = formatGrams(waterFor(recipe), method.waterUnit);
  const rows: [string, string][] = [
    ['Café', formatGrams(recipe.coffeeG)],
    [method.output === 'drink' ? 'Bebida' : 'Água', water],
    ['Proporção', formatRatio(recipe.ratio)],
  ];
  if (recipe.clicks != null) {
    rows.push(['Moagem', `${recipe.clicks} cliques${grinder && grinder.id !== 'custom' ? ` · ${grinder.name}` : ''}`]);
  }
  if (recipe.timeSec) rows.push(['Tempo', formatTime(recipe.timeSec)]);

  const asText = () =>
    [
      `☕ Minha receita de ${method.name}`,
      ...rows.map(([k, v]) => `${k}: ${v}`),
      recipe.notes ? `“${recipe.notes}”` : '',
      `Feita com o app ${APP_NAME}`,
    ]
      .filter(Boolean)
      .join('\n');

  const share = async () => {
    setBusy(true);
    try {
      if (Platform.OS !== 'web' && (await Sharing.isAvailableAsync())) {
        const uri = await captureRef(cardRef, { format: 'png', quality: 1 });
        await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: 'Compartilhar receita', UTI: 'public.png' });
      } else {
        await Share.share({ message: asText() });
      }
    } catch {
      // Capturing can fail on odd devices; plain text still gets the recipe out.
      await Share.share({ message: asText() }).catch(() => {});
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <ScrollView contentContainerStyle={styles.sheet}>
        <View ref={cardRef} collapsable={false} style={styles.card}>
          <Text style={styles.brand}>{APP_NAME}</Text>
          <Text style={styles.title}>
            {method.emoji} Minha receita de {method.name}
          </Text>
          <CoffeeScene height={130} />
          <View style={styles.rows}>
            {rows.map(([k, v]) => (
              <View key={k} style={styles.row}>
                <Text style={styles.key}>{k}</Text>
                <Text style={styles.value}>{v}</Text>
              </View>
            ))}
          </View>
          {recipe.notes ? <Text style={styles.notes}>“{recipe.notes}”</Text> : null}
          <Text style={styles.footer}>Feita com o app {APP_NAME} ☕</Text>
        </View>
        <View style={styles.actions}>
          <Button label="Fechar" variant="secondary" onPress={onClose} />
          <Button label={busy ? 'Preparando…' : '📤 Compartilhar'} onPress={share} disabled={busy} />
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheet: { padding: spacing.md, gap: spacing.md, backgroundColor: colors.background, flexGrow: 1 },
  card: {
    backgroundColor: colors.primaryDark,
    borderRadius: radius + 10,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  brand: { color: colors.accent, fontWeight: '800', fontSize: 14, letterSpacing: 2, textTransform: 'uppercase' },
  title: { color: '#fff', fontSize: 24, fontWeight: '800' },
  rows: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: radius, padding: spacing.md, gap: spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
  key: { color: '#E9D8C6', fontSize: 16 },
  value: { color: '#fff', fontSize: 16, fontWeight: '700', flexShrink: 1, textAlign: 'right' },
  notes: { color: '#E9D8C6', fontStyle: 'italic', fontSize: 15 },
  footer: { color: '#C9B29B', fontSize: 13, textAlign: 'center', marginTop: spacing.xs },
  actions: { flexDirection: 'row', gap: spacing.sm },
});
