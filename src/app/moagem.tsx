import { ScrollView, Text, View } from 'react-native';
import { GRIND_SCALE, METHODS } from '../data/methods';
import { Card, SectionTitle, styles as ui } from '../components/ui';
import { GrindScale } from '../components/GrindScale';
import { GrinderGuide } from '../components/GrinderGuide';

export default function Moagem() {
  return (
    <ScrollView contentContainerStyle={ui.screen}>
      <Text style={ui.body}>
        Quanto mais fino o pó, mais rápido a água extrai o sabor. Por isso cada método pede uma moagem diferente: quanto
        menos tempo a água fica em contato com o café, mais fina deve ser a moagem.
      </Text>
      <GrinderGuide />
      {GRIND_SCALE.map((g) => {
        const methods = METHODS.filter((m) => m.grind === g.level);
        return (
          <Card key={g.level}>
            <SectionTitle>{g.name}</SectionTitle>
            <GrindScale level={g.level} />
            <Text style={ui.body}>Parece: {g.looksLike}</Text>
            <Text style={ui.muted}>Partículas de {g.microns}</Text>
            {methods.length > 0 && (
              <View>
                {methods.map((m) => (
                  <Text key={m.id} style={ui.body}>
                    {m.emoji} {m.name}: {m.grindTip}
                  </Text>
                ))}
              </View>
            )}
          </Card>
        );
      })}
      <Card>
        <SectionTitle>Ajustando pelo sabor</SectionTitle>
        <Text style={ui.body}>😖 Amargo, seco, demorou demais → moa mais grosso.</Text>
        <Text style={ui.body}>😬 Azedo, aguado, passou rápido demais → moa mais fino.</Text>
        <Text style={ui.muted}>Mude um pouco de cada vez e anote o que funcionou.</Text>
      </Card>
    </ScrollView>
  );
}
