import { StyleSheet, Text, View } from 'react-native';
import { GRIND_SCALE, type GrindLevel } from '../data/methods';
import { colors, spacing } from '../lib/theme';

/** A strip from finest to coarsest grind, highlighting the method's level. */
export function GrindScale({ level }: { level: GrindLevel }) {
  return (
    <View style={{ gap: spacing.xs }}>
      <View style={styles.strip}>
        {GRIND_SCALE.map((g, i) => {
          const active = g.level === level;
          return (
            <View
              key={g.level}
              style={[styles.segment, { opacity: active ? 1 : 0.25 + i * 0.08 }, active && styles.active]}
            >
              <View style={[styles.dot, { width: 4 + i * 2, height: 4 + i * 2 }]} />
            </View>
          );
        })}
      </View>
      <View style={styles.labels}>
        <Text style={styles.label}>Mais fina</Text>
        <Text style={styles.label}>Mais grossa</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  strip: { flexDirection: 'row', gap: 4 },
  segment: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  active: { borderWidth: 3, borderColor: colors.accent },
  dot: { borderRadius: 99, backgroundColor: '#F3E2CF' },
  labels: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontSize: 12, color: colors.muted },
});
