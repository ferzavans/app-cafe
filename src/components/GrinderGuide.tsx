import { StyleSheet, Text, TextInput, View } from 'react-native';
import { BREWS, CUSTOM_GRINDER_ID, GRINDERS, formatSetting, type BrewId } from '../data/grinders';
import { grindInfo } from '../data/methods';
import { useSettings } from '../lib/settings';
import { colors, spacing } from '../lib/theme';
import { Card, Chip, SectionTitle, styles as ui } from './ui';
import { BuyButtons } from './BuyButtons';

export const APPROX_NOTE = 'Ponto de partida aproximado: ajuste pelo sabor.';

/** Grinder picker plus the clicks table for the chosen grinder. */
export function GrinderGuide() {
  const { grinder, setGrinderId, customClicks, setCustomClicks } = useSettings();
  const isCustom = grinder?.id === CUSTOM_GRINDER_ID;

  const setClick = (brew: BrewId, text: string) => {
    const n = parseInt(text, 10);
    const next = { ...customClicks };
    if (Number.isFinite(n) && n >= 0) next[brew] = n;
    else delete next[brew];
    setCustomClicks(next);
  };

  return (
    <>
      <Card>
        <SectionTitle>Seu moedor</SectionTitle>
        <Text style={ui.muted}>Escolha o seu para ver quantos cliques usar em cada preparo.</Text>
        <View style={ui.row}>
          {GRINDERS.map((g) => (
            <Chip
              key={g.id}
              label={g.name}
              selected={grinder?.id === g.id}
              onPress={() => setGrinderId(grinder?.id === g.id ? null : g.id)}
            />
          ))}
          <Chip
            label="✏️ Meu moedor (personalizado)"
            selected={isCustom}
            onPress={() => setGrinderId(isCustom ? null : CUSTOM_GRINDER_ID)}
          />
        </View>
      </Card>

      {grinder && (
        <Card>
          <SectionTitle>
            {grinder.kind === 'eletrico' ? 'Regulagem' : 'Cliques'} no {grinder.name}
          </SectionTitle>
          {isCustom ? (
            <Text style={ui.muted}>Digite os cliques (contados do zero) que funcionaram para você. Fica salvo no celular.</Text>
          ) : (
            <Text style={ui.muted}>
              Contados a partir do zero (mós fechadas). {APPROX_NOTE}
              {grinder.confidence === 'estimativa' &&
                ' Não achamos tabela oficial deste modelo: os números são uma estimativa. Anote o que funcionar em "Meu moedor".'}
            </Text>
          )}
          {BREWS.map((b) => (
            <View key={b.id} style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={ui.body}>
                  {b.emoji} {b.name}
                </Text>
                <Text style={styles.grind}>Moagem {grindInfo(b.grind).name.toLowerCase()}</Text>
              </View>
              {isCustom ? (
                <TextInput
                  accessibilityLabel={`Cliques para ${b.name}`}
                  value={customClicks[b.id] == null ? '' : String(customClicks[b.id])}
                  onChangeText={(t) => setClick(b.id, t)}
                  keyboardType="number-pad"
                  placeholder="—"
                  placeholderTextColor={colors.muted}
                  style={styles.input}
                />
              ) : (
                <Text style={[styles.value, !grinder.settings[b.id] && { color: colors.muted }]}>
                  {formatSetting(grinder, b.id)}
                </Text>
              )}
            </View>
          ))}
          {!isCustom && <BuyButtons linkKey={grinder.id} query={grinder.name} label={`Onde comprar o ${grinder.name}`} />}
        </Card>
      )}

      {grinder && (
        <Card>
          <SectionTitle>Como regular</SectionTitle>
          <Text style={ui.body}>{grinder.zeroHowTo}</Text>
          {grinder.tips.map((t) => (
            <Text key={t} style={ui.body}>
              • {t}
            </Text>
          ))}
          <Text style={ui.muted}>
            Mude de 1 em 1 clique e prove: amargo e lento → mais grosso (mais cliques); azedo e rápido → mais fino (menos
            cliques).
          </Text>
        </Card>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  grind: { fontSize: 12, color: colors.muted },
  value: { fontSize: 15, fontWeight: '700', color: colors.primary, textAlign: 'right' },
  input: {
    width: 64,
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 6,
  },
});
