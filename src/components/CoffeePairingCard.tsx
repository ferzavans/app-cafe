import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { PAIRINGS, profileInfo, roastInfo } from '../data/coffees';
import type { MethodId } from '../data/methods';
import { colors, spacing } from '../lib/theme';
import { Card, SectionTitle, styles as ui } from './ui';
import { BuyButtons } from './BuyButtons';
import { PROFILE_SEARCH } from '../data/affiliateLinks';

/** Which coffee to buy for a method: roast, flavor profiles and why. */
export function CoffeePairingCard({ methodId, methodName }: { methodId: MethodId; methodName: string }) {
  const pairing = PAIRINGS[methodId];
  const best = profileInfo(pairing.profiles[0]);
  return (
    <Card>
      <SectionTitle>☕ Café ideal para {methodName}</SectionTitle>
      <Text style={ui.body}>{pairing.why}</Text>
      <Text style={ui.stepperLabel}>Torra</Text>
      <View style={ui.row}>
        {pairing.roasts.map((r, i) => (
          <View key={r} style={[styles.tag, i === 0 && styles.tagBest]}>
            <Text style={[styles.tagText, i === 0 && { color: '#fff' }]}>{roastInfo(r).name}</Text>
          </View>
        ))}
      </View>
      <Text style={ui.stepperLabel}>Perfil de sabor</Text>
      <View style={ui.row}>
        {pairing.profiles.map((p, i) => {
          const info = profileInfo(p);
          return (
            <View key={p} style={[styles.tag, i === 0 && styles.tagBest]}>
              <Text style={[styles.tagText, i === 0 && { color: '#fff' }]}>
                {info.emoji} {info.name}
              </Text>
            </View>
          );
        })}
      </View>
      <Text style={ui.muted}>No pacote, procure: {best.onTheBag}</Text>
      <BuyButtons linkKey={`cafe-${best.id}`} query={PROFILE_SEARCH[best.id]} label={`Comprar café ${best.name.toLowerCase()}`} />
      <Pressable onPress={() => router.push('/cafes')}>
        <Text style={styles.link}>Ver guia de tipos de café ›</Text>
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  tag: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: '#F3E2CF',
  },
  tagBest: { backgroundColor: colors.accent },
  tagText: { color: colors.primaryDark, fontWeight: '600', fontSize: 14 },
  link: { color: colors.accent, fontWeight: '600', fontSize: 16, paddingTop: spacing.xs },
});
