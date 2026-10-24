import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { PAIRINGS, PROFILES, ROASTS, methodsForProfile, type ProfileId } from '../data/coffees';
import { getMethod } from '../data/methods';
import { Card, Chip, SectionTitle, styles as ui } from '../components/ui';
import { colors, spacing } from '../lib/theme';
import { BuyButtons } from '../components/BuyButtons';
import { PROFILE_SEARCH } from '../data/affiliateLinks';

export default function Cafes() {
  const [profileId, setProfileId] = useState<ProfileId>('chocolate');
  const profile = PROFILES.find((p) => p.id === profileId)!;
  const methods = methodsForProfile(profileId);

  return (
    <ScrollView contentContainerStyle={ui.screen}>
      <Text style={ui.body}>
        Cada café combina melhor com um jeito de preparar. Escolha o tipo de café que você tem (ou quer comprar) e veja
        os métodos em que ele fica melhor.
      </Text>

      <Card>
        <SectionTitle>Que café você tem?</SectionTitle>
        <View style={ui.row}>
          {PROFILES.map((p) => (
            <Chip key={p.id} label={`${p.emoji} ${p.name}`} selected={p.id === profileId} onPress={() => setProfileId(p.id)} />
          ))}
        </View>
      </Card>

      <Card>
        <SectionTitle>
          {profile.emoji} {profile.name}
        </SectionTitle>
        <Text style={ui.body}>{profile.tastes}</Text>
        <Text style={ui.muted}>Exemplos: {profile.examples}</Text>
        <Text style={ui.muted}>No pacote: {profile.onTheBag}</Text>
        <BuyButtons linkKey={`cafe-${profile.id}`} query={PROFILE_SEARCH[profile.id]} label="Comprar este tipo de café" />
        <Text style={[ui.stepperLabel, { marginTop: spacing.xs }]}>Fica melhor em</Text>
        {methods.map((id) => {
          const m = getMethod(id)!;
          return (
            <Pressable
              key={id}
              accessibilityRole="button"
              onPress={() => router.push({ pathname: '/metodo/[id]', params: { id } })}
              style={({ pressed }) => [styles.method, pressed && { opacity: 0.7 }]}
            >
              <Text style={styles.methodEmoji}>{m.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.methodName}>
                  {m.name}
                  {PAIRINGS[id].profiles[0] === profileId && <Text style={styles.best}>  ★ ideal</Text>}
                </Text>
                <Text style={ui.muted} numberOfLines={2}>
                  {PAIRINGS[id].why}
                </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          );
        })}
      </Card>

      <Card>
        <SectionTitle>Entendendo a torra</SectionTitle>
        {ROASTS.map((r) => (
          <View key={r.id} style={{ gap: 2 }}>
            <Text style={[ui.body, { fontWeight: '700' }]}>{r.name}</Text>
            <Text style={ui.muted}>{r.text}</Text>
          </View>
        ))}
      </Card>

      <Card>
        <SectionTitle>Dicas na hora de comprar</SectionTitle>
        <Text style={ui.body}>• Prefira café em grãos e moa na hora: o aroma vai embora poucos dias depois de moído.</Text>
        <Text style={ui.body}>• Olhe a data de torra: o melhor é entre 7 e 30 dias depois dela.</Text>
        <Text style={ui.body}>• Guarde num pote fechado, longe da luz e do calor. Geladeira não!</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  method: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  methodEmoji: { fontSize: 28 },
  methodName: { fontSize: 17, fontWeight: '700', color: colors.text },
  best: { fontSize: 13, color: colors.accent, fontWeight: '700' },
  chevron: { fontSize: 26, color: colors.muted },
});
