# Compatibilité navigateurs – marges et layout

Ce document résume la compatibilité des fonctionnalités CSS et front utilisées pour les **marges** (navbar, footer, pages) et le **logo**.

---

## Cible (browserslist)

- Dernières 3 versions : Chrome, Firefox, Safari, Edge  
- iOS >= 12  
- Navigateurs non abandonnés  

---

## Fonctionnalités utilisées

| Fonctionnalité | Chrome | Firefox | Safari | Edge | Notes |
|----------------|--------|---------|--------|------|--------|
| **Variables CSS** (`--var`) | 49+ | 31+ | 9.1+ | 15+ | OK pour la cible |
| **`calc(var(...))`** | idem | idem | idem | idem | OK |
| **`env(safe-area-inset-*)`** | 69+ | 69+ | 11.2+ | 79+ | Fallback `0px` dans la règle |
| **`-webkit-padding-start/end`** | oui | oui | oui (logical) | oui | Alignement RTL + Safari |
| **`transform` / `transform-origin`** | tous récents | idem | idem | idem | Logo scale(2) + origin left |
| **`@layer`** (base/components/utilities) | 99+ | 97+ | 15.4+ | 99+ | OK pour « last 3 » |

---

## Mesures prises pour la compatibilité

1. **Safe area** : `env(safe-area-inset-left, 0px)` avec valeur de repli pour les navigateurs sans support.
2. **Safari / RTL** : `-webkit-padding-start` et `-webkit-padding-end` sur `.content-wrap`, `.content-edge` et `header .content-wrap`.
3. **Logo** : `transform-origin: left center` quand `align="left"` pour éviter le débordement visuel ; `transform: scale(2)` reste compatible.
4. **Viewport** : `min-height: 100vh`, `-webkit-fill-available`, `100dvh` pour limiter les écarts mobile (barre d’adresse, etc.).

---

## Résumé

Les marges (variables, `content-wrap`, `content-edge`, header, footer, pages) et le comportement du logo sont compatibles avec la **browserslist** du projet (Chrome, Firefox, Safari, Edge récents, iOS 12+). Les préfixes et fallbacks utilisés couvrent Safari et les cas courants (safe area, direction d’écriture).
