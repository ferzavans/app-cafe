import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useKeepAwake } from 'expo-keep-awake';
import { Button, Card, Chip, SectionTitle, ToggleRow, styles as ui } from '../components/ui';
import { formatTime } from '../lib/calc';
import { useAlerts } from '../lib/alerts';
import { useClock } from '../lib/useClock';
import { useSettings } from '../lib/settings';
import { colors, radius, spacing } from '../lib/theme';

type Mode = 'countdown' | 'stopwatch';

const COUNTDOWN_PRESETS = [30, 45, 60, 120, 180, 240];
const INTERVALS = [
  { label: 'Sem aviso', sec: 0 },
  { label: 'A cada 30 s', sec: 30 },
  { label: 'A cada 1 min', sec: 60 },
];

export default function TimerScreen() {
  useKeepAwake();
  const settings = useSettings();
  const { alertStep, alertFinish } = useAlerts();
  const clock = useClock();
  const [mode, setMode] = useState<Mode>('countdown');
  const [targetSec, setTargetSec] = useState(180);
  const [intervalSec, setIntervalSec] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const lastBeep = useRef(0);

  const elapsedSec = clock.elapsedMs / 1000;

  useEffect(() => {
    if (!clock.running) return;
    if (mode === 'countdown' && elapsedSec >= targetSec) {
      clock.pause();
      setDone(true);
      alertFinish();
    } else if (mode === 'stopwatch' && intervalSec > 0) {
      const mark = Math.floor(elapsedSec / intervalSec);
      if (mark > lastBeep.current) {
        lastBeep.current = mark;
        alertStep();
      }
    }
  }, [elapsedSec, clock, mode, targetSec, intervalSec, alertStep, alertFinish]);

  const reset = () => {
    clock.reset();
    setLaps([]);
    setDone(false);
    lastBeep.current = 0;
  };

  const toggle = () => {
    if (clock.running) return clock.pause();
    if (done) reset();
    clock.start();
  };

  const switchMode = (m: Mode) => {
    reset();
    setMode(m);
  };

  const display =
    mode === 'countdown' ? formatTime(targetSec - elapsedSec) : formatTime(Math.floor(elapsedSec));
  const idle = !clock.running && clock.elapsedMs === 0;

  return (
    <ScrollView contentContainerStyle={ui.screen}>
      <View style={ui.row}>
        <Chip label="Contagem regressiva" selected={mode === 'countdown'} onPress={() => switchMode('countdown')} />
        <Chip label="Cronômetro" selected={mode === 'stopwatch'} onPress={() => switchMode('stopwatch')} />
      </View>

      <View style={styles.stage}>
        <Text style={styles.clock}>{display}</Text>
        {done && <Text style={styles.done}>Tempo! ☕</Text>}
      </View>

      <View style={styles.controls}>
        <Button
          label={clock.running ? '❚❚  Pausar' : done ? '↺  De novo' : idle ? '▶  Iniciar' : '▶  Continuar'}
          onPress={toggle}
        />
        {mode === 'stopwatch' && clock.running ? (
          <Button label="Marcar" variant="secondary" onPress={() => setLaps((l) => [elapsedSec, ...l])} />
        ) : (
          <Button label="↺  Zerar" variant="secondary" onPress={reset} disabled={idle} />
        )}
      </View>

      {mode === 'countdown' ? (
        <Card>
          <SectionTitle>Tempo</SectionTitle>
          <View style={ui.row}>
            {COUNTDOWN_PRESETS.map((s) => (
              <Chip
                key={s}
                label={formatTime(s)}
                selected={s === targetSec}
                onPress={() => {
                  reset();
                  setTargetSec(s);
                }}
              />
            ))}
          </View>
          <View style={styles.controls}>
            <Button label="− 15 s" variant="secondary" onPress={() => setTargetSec((t) => Math.max(15, t - 15))} disabled={!idle} />
            <Button label="+ 15 s" variant="secondary" onPress={() => setTargetSec((t) => t + 15)} disabled={!idle} />
          </View>
        </Card>
      ) : (
        <Card>
          <SectionTitle>Aviso durante o preparo</SectionTitle>
          <Text style={ui.muted}>Útil para marcar os despejos da V60.</Text>
          <View style={ui.row}>
            {INTERVALS.map((i) => (
              <Chip key={i.sec} label={i.label} selected={i.sec === intervalSec} onPress={() => setIntervalSec(i.sec)} />
            ))}
          </View>
          {laps.map((t, i) => (
            <Text key={i} style={ui.body}>
              Marca {laps.length - i}: {formatTime(Math.floor(t))}
            </Text>
          ))}
        </Card>
      )}

      <Card>
        <ToggleRow label="🔔 Aviso sonoro" value={settings.soundOn} onChange={settings.setSoundOn} />
        <Button label="Testar aviso" variant="secondary" onPress={alertFinish} />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  stage: { backgroundColor: colors.primaryDark, borderRadius: radius, padding: spacing.xl, alignItems: 'center' },
  clock: { color: '#fff', fontSize: 80, fontWeight: '200', fontVariant: ['tabular-nums'] },
  done: { color: colors.accent, fontSize: 22, fontWeight: '800' },
  controls: { flexDirection: 'row', gap: spacing.sm },
});
