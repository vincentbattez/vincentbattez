# Chat de recommandation : AI SDK pour le moteur, markup maison pour l'UI

## Contexte

La page `/recommendation` héberge un Entretien de recommandation : un Collègue converse avec Ruby, qui produit une Recommandation. Consigne explicite : ne pas recoder un chat, la responsabilité du portfolio se limite au prompt et au besoin métier.

Le repo est en **Tailwind 3.4** (`@nuxtjs/tailwindcss` 6), sans design system : chaque écran est stylé à la main dans la charte du site, avec des seuils Lighthouse en CI.

## Décision

On prend **`ai@7` + `@ai-sdk/vue@4`** (`useChat`) pour tout le moteur — streaming, état des messages, parts de reasoning, `status`, `stop`, `regenerate`, tool calls — et **`@comark/vue`** pour le rendu Markdown streaming-aware. L'UI (bulles, saisie, encart Recommandation) est du markup Vue écrit dans la charte existante.

On **n'adopte pas Nuxt UI v4**, seul kit UI de chat LLM complet côté Vue.

## Considered Options

- **Nuxt UI v4** (`UChatMessages`, `UChatPrompt`, `UChatReasoning`) — écarté : impose la migration **Tailwind v3 → v4** sur tout le site pour une page cachée, importe Reka UI + un design system étranger à la charte, et fait porter un risque de régression à la home et aux seuils Lighthouse.
- **Widget hébergé tiers** (Chatbase, Typebot) — écarté : perte d'OpenRouter, du contrôle du prompt et de la charte.
- **`vue-advanced-chat`** — écarté : UI de messagerie, pas de streaming LLM, pas de reasoning.
- **AI SDK + markup maison** — retenu : « pas de code maison » vise la *logique*, pas le *balisage*. Le balisage est précisément ce qui rend la page reconnaissable comme la tienne.

## Consequences

- **Zéro logique de chat écrite à la main** : tout comportement non couvert par `useChat` doit interroger la pertinence de la feature, pas déclencher du code maison.
- `@comark/vue` n'a qu'une dépendance réelle (`comark`) ; `shiki`, `katex` et `beautiful-mermaid` sont `peerDependenciesMeta.optional` et ne sont **pas** installés. Empreinte négligeable, seuils Lighthouse préservés.
- Si un second écran de chat apparaît un jour, le calcul change : le coût de Nuxt UI s'amortit, celui du markup maison se duplique.
