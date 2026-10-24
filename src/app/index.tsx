import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { METHODS, grindInfo } from '../data/methods';
import { brewForMethod, formatSetting } from '../data/grinders';
import { CoffeeScene } from '../components/CoffeeScene';
import { SectionTitle, styles as ui } from '../components/ui';
import { useSettings } from '../lib/settings';
import { colors, radius, spacing } from '../lib/theme';

const TOOLS = [
  { href: '/calculadora', emoji: '⚖️', title: 'Calculadora', text: 'Café, água e grãos' },
  { href: '/timer', emoji: '⏱️', title: 'Cronômetro', text: 'Com aviso sonoro' },
  { href: '/moagem', emoji: '⚙️', title: 'Moagem', text: 'Cliques do seu moedor' },
  { href: '/cafes', emoji: '🫘', title: 'Tipos de café', text: 'O café certo pro método' },
] as const;

function greeting(hour: number) {
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

export default function Home() {
  const insets = useSafeAreaInsets();
  const { grinder, savedRecipes } = useSettings();

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
      <View style={[styles.hero, { paddingTop: insets.top + spacing.md }]}>
        <Text style={styles.heroTitle}>{greeting(new Date().getHours())}! ☕</Text>
        <Text style={styles.heroText}>Que café vamos passar hoje?</Text>
        <CoffeeScene height={190} />
      </View>

      <View style={[ui.screen, styles.body]}>
        <SectionTitle>Escolha o método</SectionTitle>
        {METHODS.map((m) => {
          const brew = brewForMethod(m.id);
          return (
            <Pressable
              key={m.id}
              accessibilityRole="button"
              accessibilityLabel={`Abrir ${m.name}`}
              onPress={() => router.push({ pathname: '/metodo/[id]', params: { id: m.id } })}
              style={({ pressed }) => [styles.methodCard, pressed && styles.pressed]}
            >
              <View style={styles.iconBubble}>
                <Text style={styles.emoji}>{m.emoji}</Text>
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={styles.methodName}>
                  {m.name}
                  {savedRecipes[m.id] && <Text style={styles.star}>  ⭐ minha receita</Text>}
                </Text>
                <Text style={ui.muted}>
                  Moagem {grindInfo(m.grind).name.toLowerCase()} · {m.totalTime}
                </Text>
                {grinder && brew && (
                  <Text style={styles.clicks}>
                    ⚙️ {formatSetting(grinder, brew)}
                  </Text>
                )}
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          );
        })}

        <SectionTitle>Ferramentas</SectionTitle>
        <View style={styles.tools}>
          {TOOLS.map((t) => (
            <Pressable
              key={t.href}
              accessibilityRole="button"
              style={({ pressed }) => [styles.tool, pressed && styles.pressed]}
              onPress={() => router.push(t.href)}
            >
              <View style={[styles.iconBubble, styles.toolBubble]}>
                <Text style={styles.toolEmoji}>{t.emoji}</Text>
              </View>
              <Text style={styles.toolTitle}>{t.title}</Text>
              <Text style={[ui.muted, styles.toolText]}>{t.text}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/moagem')}
          style={({ pressed }) => [styles.grinderBar, pressed && styles.pressed]}
        >
          <Text style={styles.grinderText}>
            {grinder ? `Seu moedor: ${grinder.name}` : 'Escolha seu moedor e veja os cliques certos'}
          </Text>
          <Text style={styles.grinderLink}>{grinder ? 'Trocar ›' : 'Escolher ›'}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const shadow = {
  shadowColor: '#4A3224',
  shadowOpacity: 0.12,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
};

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    gap: spacing.xs,
  },
  heroTitle: { color: '#fff', fontSize: 30, fontWeight: '800' },
  heroText: { color: '#E9D8C6', fontSize: 17 },
  body: { paddingTop: spacing.lg },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius + 4,
    padding: spacing.md,
    ...shadow,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  iconBubble: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F3E2CF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 28 },
  methodName: { fontSize: 20, fontWeight: '700', color: colors.text },
  star: { fontSize: 13, fontWeight: '700', color: colors.accent },
  clicks: { fontSize: 13, fontWeight: '700', color: colors.accent },
  chevron: { fontSize: 30, color: colors.muted },
  tools: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  tool: {
    flexGrow: 1,
    flexBasis: '45%',
    backgroundColor: colors.card,
    borderRadius: radius + 4,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    gap: spacing.xs,
    ...shadow,
  },
  toolBubble: { width: 48, height: 48, borderRadius: 24 },
  toolEmoji: { fontSize: 24 },
  toolTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  toolText: { textAlign: 'center', fontSize: 12 },
  grinderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    backgroundColor: '#F3E2CF',
    borderRadius: radius,
    padding: spacing.md,
  },
  grinderText: { flex: 1, fontSize: 15, color: colors.primaryDark, fontWeight: '600' },
  grinderLink: { fontSize: 15, color: colors.accent, fontWeight: '700' },
});
