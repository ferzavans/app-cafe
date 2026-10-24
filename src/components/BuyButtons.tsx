import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { STORE_NAMES, buyUrl, type Store } from '../data/affiliateLinks';
import { colors, spacing } from '../lib/theme';

const STORES: Store[] = ['amazon', 'mercadolivre'];

/** "Onde comprar" links to the stores; `linkKey` picks a custom affiliate link from affiliateLinks.ts. */
export function BuyButtons({ linkKey, query, label = 'Onde comprar' }: { linkKey: string; query: string; label?: string }) {
  return (
    <View style={{ gap: spacing.xs }}>
      <Text style={styles.label}>🛒 {label}</Text>
      <View style={styles.row}>
        {STORES.map((s) => (
          <Pressable
            key={s}
            accessibilityRole="link"
            accessibilityLabel={`${label} na ${STORE_NAMES[s]}`}
            onPress={() => Linking.openURL(buyUrl(s, linkKey, query)).catch(() => {})}
            style={({ pressed }) => [styles.button, pressed && { opacity: 0.7 }]}
          >
            <Text style={styles.buttonText}>{STORE_NAMES[s]} ›</Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.disclosure}>Links de afiliado: o app pode receber uma comissão, sem custo extra para você.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 14, fontWeight: '700', color: colors.muted },
  row: { flexDirection: 'row', gap: spacing.sm },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.accent,
    alignItems: 'center',
  },
  buttonText: { color: colors.accent, fontWeight: '700', fontSize: 15 },
  disclosure: { fontSize: 11, color: colors.muted },
});
