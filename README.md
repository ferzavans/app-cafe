# Café Guia ☕

App de café para Android e iOS (React Native + Expo) que ensina a preparar café na **V60**, na **Moka** e no **Espresso**.

## O que tem

- **Guia de cada método**: moagem ideal (com escala visual), temperatura da água, tempo, equipamentos e dicas.
- **Calculadora de café e água**: digite o café ou a água e o app calcula o outro, com proporções prontas (ex.: V60 1:16, Espresso 1:2) e tamanhos rápidos (xícaras, tamanhos de moka, dose simples/dupla).
- **Passo a passo com timer**: cada etapa (bloom, despejos, extração...) com as quantidades da sua receita; as etapas cronometradas avançam sozinhas com aviso sonoro (funciona mesmo no modo silencioso do iPhone).
- **Cronômetro**: contagem regressiva ou cronômetro com marcas e aviso a cada 30 s / 1 min.
- **Guia de moagem**: do extra-fino ao grosso, com o que cada moagem parece e como ajustar pelo sabor.
- A tela fica acesa enquanto o timer está aberto, e o som toca mesmo com o iPhone no modo silencioso.

## Como rodar no celular

1. Instale o [Node.js](https://nodejs.org) (versão 20 ou mais nova).
2. No celular, instale o app **Expo Go** (Play Store ou App Store).
3. No computador, dentro desta pasta:

   ```bash
   npm install
   npx expo start
   ```

4. Leia o QR code que aparece no terminal com a câmera (iPhone) ou com o Expo Go (Android).

## Comandos úteis

```bash
npm test             # testes da calculadora
npm run typecheck    # checagem de tipos
```

## Publicar nas lojas

Use o EAS Build (não precisa de Mac para gerar o app de iOS):

```bash
npx eas-cli@latest build --platform android
npx eas-cli@latest build --platform ios
```

## Estrutura

- `src/app/` telas (Expo Router): início, método, passo a passo, calculadora, cronômetro e moagem
- `src/data/methods.ts` receitas, moagens e etapas de cada método
- `src/lib/` cálculo das receitas, timer, avisos sonoros
- `assets/sounds/` sons dos avisos
