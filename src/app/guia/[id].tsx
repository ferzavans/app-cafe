import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useKeepAwake } from 'expo-keep-awake';
import { getMethod } from '../../data/methods';
import { Button, Card, ToggleRow, styles as ui } from '../../components/ui';
import { fillStepText, formatGrams, formatRatio, formatTime, parseAmount, scaleSteps, waterFor } from '../../lib/calc';
import { useAlerts } from '../../lib/alerts';
import { useClock } from '../../lib/useClock';
import { useSettings } from '../../lib/settings';
import { colors, radius, spacing } from '../../lib/theme';

export default function GuideScreen() {
  useKeepAwake();
  const params = useLocalSearchParams<{ id: string; cafe?: string; proporcao?: string; tempo?: string }>();
  const method = getMethod(params.id);
  const settings = useSettings();
  const { alertStep, alertFinish } = useAlerts();
  const stepClock = useClock();
  const totalClock = useClock();
  const [stepIndex, setStepIndex] = useState(0);
  const [started, setStarted] = useState(false);

  const recipe = {
    coffeeG: parseAmount(params.cafe ?? '') || method?.defaultCoffeeG || 15,
    ratio: parseAmount(params.proporcao ?? '') || method?.ratio.default || 16,
  };
  // A saved recipe can bring its own total time; the timed steps stretch to fit it.
  const targetSec = parseAmount(params.tempo ?? '');
  const steps = useMemo(() => scaleSteps(method?.steps ?? [], targetSec), [method, targetSec]);
  const lastIndex = steps.length - 1;
  const step = steps[stepIndex];
  const finished = started && stepIndex === lastIndex;

  /** Moves to a step; `run` keeps the clocks going, `alert` plays the cue for it. */
  const goTo = useCallback(
    (index: number, { alert, run }: { alert: boolean; run: boolean }) => {
      const next = Math.max(0, Math.min(lastIndex, index));
      setStepIndex(next);
      stepClock.reset();
      if (next === lastIndex) {
        totalClock.pause();
        if (alert) alertFinish();
        return;
      }
      if (alert) alertStep();
      if (run) {
        stepClock.start();
        totalClock.start();
      }
    },
    [lastIndex, stepClock, totalClock, alertStep, alertFinish],
  );

  // Timed steps move on by themselves when their time is up.
  useEffect(() => {
    if (!step || step.durationSec == null || !stepClock.running) return;
    if (stepClock.elapsedMs >= step.durationSec * 1000) goTo(stepIndex + 1, { alert: true, run: true });
  }, [step, stepIndex, stepClock.elapsedMs, stepClock.running, goTo]);

  if (!method || !step) {
    return (
      <View style={ui.screen}>
        <Text style={ui.body}>Método não encontrado.</Text>
      </View>
    );
  }

  const timed = step.durationSec != null;
  const remainingSec = timed ? step.durationSec! - stepClock.elapsedMs / 1000 : 0;
  const progress = timed ? Math.min(1, stepClock.elapsedMs / (step.durationSec! * 1000)) : 0;

  const startOrToggle = () => {
    if (!started) {
      setStarted(true);
      stepClock.start();
      totalClock.start();
    } else if (stepClock.running) {
      stepClock.pause();
      totalClock.pause();
    } else {
      stepClock.start();
      totalClock.start();
    }
  };

  const restart = () => {
    setStarted(false);
    setStepIndex(0);
    stepClock.reset();
    totalClock.reset();
  };

  const mainLabel = !started ? '▶  Iniciar' : stepClock.running ? '❚❚  Pausar' : '▶  Continuar';

  return (
    <ScrollView contentContainerStyle={ui.screen}>
      <Stack.Screen options={{ title: `${method.emoji} ${method.name}` }} />
      <Text style={ui.muted}>
        Receita: {formatGrams(recipe.coffeeG)} de café · {formatGrams(waterFor(recipe), method.waterUnit)}{' '}
        {method.output === 'drink' ? 'na xícara' : 'de água'} · {formatRatio(recipe.ratio)}
      </Text>

      <View style={styles.stage}>
        <Text style={styles.stepCount}>
          Etapa {stepIndex + 1} de {steps.length}
        </Text>
        <Text style={styles.stepTitle}>{step.title}</Text>
        <Text style={styles.clock}>
          {timed ? formatTime(remainingSec) : formatTime(Math.floor(stepClock.elapsedMs / 1000))}
        </Text>
        {timed ? (
          <View style={styles.bar}>
            <View style={[styles.barFill, { width: `${progress * 100}%` }]} />
          </View>
        ) : (
          !finished && <Text style={styles.hint}>Sem tempo fixo: toque em “Próxima” quando terminar.</Text>
        )}
        <Text style={styles.stepText}>{fillStepText(step.text, recipe, method.waterUnit)}</Text>
        <Text style={styles.total}>Tempo total {formatTime(Math.floor(totalClock.elapsedMs / 1000))}</Text>
      </View>

      {finished ? (
        <Button label="↺  Preparar de novo" onPress={restart} />
      ) : (
        <View style={styles.controls}>
          <Button label={mainLabel} onPress={startOrToggle} />
          <Button
            label="Próxima ›"
            variant="secondary"
            onPress={() => {
              setStarted(true);
              goTo(stepIndex + 1, { alert: false, run: true });
            }}
          />
        </View>
      )}
      {started && !finished && (
        <View style={styles.controls}>
          <Button label="‹ Etapa anterior" variant="secondary" onPress={() => goTo(stepIndex - 1, { alert: false, run: stepClock.running })} disabled={stepIndex === 0} />
          <Button label="↺ Recomeçar" variant="secondary" onPress={restart} />
        </View>
      )}

      <Card>
        {steps.map((s, i) => (
          <View key={s.title} style={styles.listRow}>
            <Text style={[styles.listMark, i < stepIndex && { color: colors.success }]}>
              {i < stepIndex ? '✓' : i === stepIndex ? '●' : '○'}
            </Text>
            <Text style={[ui.body, { flex: 1 }, i === stepIndex && { fontWeight: '700' }]}>{s.title}</Text>
            <Text style={ui.muted}>{s.durationSec != null ? formatTime(s.durationSec) : 'manual'}</Text>
          </View>
        ))}
      </Card>

      <Card>
        <ToggleRow label="🔔 Aviso sonoro" value={settings.soundOn} onChange={settings.setSoundOn} />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  stage: {
    backgroundColor: colors.primaryDark,
    borderRadius: radius,
    padding: spacing.lg,
    gap: spacing.sm,
    alignItems: 'center',
  },
  stepCount: { color: '#D9C2A7', fontSize: 14, fontWeight: '600' },
  stepTitle: { color: '#fff', fontSize: 24, fontWeight: '800', textAlign: 'center' },
  clock: { color: '#fff', fontSize: 64, fontWeight: '200', fontVariant: ['tabular-nums'] },
  bar: { alignSelf: 'stretch', height: 8, borderRadius: 4, backgroundColor: '#6B4E3D', overflow: 'hidden' },
  barFill: { height: 8, backgroundColor: colors.accent },
  hint: { color: '#D9C2A7', fontSize: 13, textAlign: 'center' },
  stepText: { color: '#F5EBDD', fontSize: 17, lineHeight: 24, textAlign: 'center' },
  total: { color: '#D9C2A7', fontSize: 14, marginTop: spacing.xs },
  controls: { flexDirection: 'row', gap: spacing.sm },
  listRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  listMark: { width: 18, fontSize: 16, color: colors.accent, textAlign: 'center' },
});
