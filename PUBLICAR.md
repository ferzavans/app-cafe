# Como publicar o Café Guia nas lojas

O app já está configurado para as lojas: nome **Café Guia**, versão 1.0.0, identificador `com.luis.appcafe`, ícone e tela de abertura com cara de café, e o arquivo `eas.json` com os perfis de build. Falta só a parte que precisa ser feita no seu nome.

## 1. Criar as contas (no seu nome)

| Loja | Custo | Onde |
|---|---|---|
| Apple (iPhone) | US$ 99 por ano | https://developer.apple.com/programs/enroll/ |
| Google Play (Android) | US$ 25, pagamento único | https://play.google.com/console/signup |
| Expo (já tem: `ferzavans`) | grátis no plano básico | https://expo.dev |

A aprovação da conta Apple pode levar de 1 a 2 dias.

## 2. Instalar a ferramenta de build (uma vez só)

No PowerShell, dentro da pasta `app-cafe`:

```bash
npm install -g eas-cli
eas login
eas init
```

O `eas init` liga o projeto à sua conta Expo e grava o ID do projeto no `app.json`.

## 3. Testar no iPhone com TestFlight (recomendado antes de publicar)

```bash
eas build --platform ios --profile production
eas submit --platform ios --latest
```

- O build roda na nuvem da Expo, então não precisa de Mac. Na primeira vez ele pede o login da Apple e cria os certificados sozinho.
- Depois do `submit`, o app aparece no App Store Connect → TestFlight. Dá para convidar até 10 mil testadores por link, ótimo para mandar para youtubers e amigos.

## 4. Android

```bash
eas build --platform android --profile production
eas submit --platform android --latest
```

Na primeira vez, o Google pede para criar o app manualmente no Play Console e fazer um primeiro envio. Dá para começar pelo "Teste interno".

## 5. O que as lojas pedem na página do app

- **Política de privacidade (link público).** O app não coleta dados pessoais: tudo fica salvo só no celular. Dá para publicar uma página simples de graça (Google Sites, Notion ou GitHub Pages) dizendo isso e mencionando os links de afiliado.
- **Prints da tela**, de iPhone 6,7" e de celular Android. Dá para tirar do próprio celular.
- **Descrição**, categoria (Comidas e bebidas), classificação etária (Livre) e e-mail de contato.

## 6. Links de afiliado

Edite só o arquivo `src/data/affiliateLinks.ts`:

- **Amazon Associados** (https://associados.amazon.com.br): cole sua tag em `AMAZON_TAG`.
- **Mercado Livre** (programa de afiliados): cole os links gerados em `CUSTOM_LINKS`, na chave do produto (ex: `'timemore-c3'`).

## 7. Atualizações futuras

Mude o que quiser e rode de novo os comandos de `build` e `submit`. O número do build sobe sozinho (`autoIncrement`). Para uma versão nova "visível", mude `"version"` no `app.json` (ex: `1.1.0`).

## Observações

- O perfil `development` do `eas.json` só é necessário se um dia o app usar algo que o Expo Go não tem, como anúncios ou compras dentro do app. Nesse caso, instale antes com `npx expo install expo-dev-client`.
- O app foi configurado só para iPhone (sem iPad), para a Apple não exigir prints de iPad.
