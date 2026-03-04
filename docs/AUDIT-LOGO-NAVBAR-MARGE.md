# Audit : logo navbar et marge CSS

## Objectif
Comprendre pourquoi le logo de la navbar semble à l’extrême gauche et ne pas respecter la marge définie.

---

## 1. Définition de la marge (CSS)

### Variables (`src/index.css`)
- **`--page-margin`** : 1.5rem (mobile), 2rem (≥640px), 2.5rem (≥768px)
- **`--content-px`** : reprend ces valeurs (responsive via media queries sur `:root`)
- **`--safe-area-left`** / **`--safe-area-right`** : `env(safe-area-inset-left/right, 0px)`

### Conteneurs
- **`.content-wrap`** (dans `@layer components`) :  
  `padding-left: calc(var(--content-px) + var(--safe-area-left))` (et idem à droite, + variantes 640px / 768px).  
  Utilisé par TopInfoBar, Footer, Navbar, pages.
- **`header .content-wrap`** (règle hors layer, lignes 108–123) :  
  Réapplique le même padding pour le header (priorité plus forte).

**Conclusion** : La marge est bien définie et appliquée au conteneur `.content-wrap` du header.

---

## 2. Structure frontend (navbar)

### Arborescence réelle
```
div.relative
  └─ motion.header (fixed, full width)
       └─ div.content-wrap          ← padding gauche/droite = marge
            └─ div.flex (logo, nav, boutons)
                 └─ Link.header-logo
                      └─ Logo (align="left")
                           └─ div (flex, justify-start)
                                └─ img (scale(2.0))
```

Le logo est bien **à l’intérieur** de `content-wrap`. En layout (boîte CSS), son bord gauche est donc après le padding.

---

## 3. Cause réelle du décalage visuel

### Rôle du `transform: scale(2.0)` (Logo.tsx)
- L’image du logo a **`transform: scale(2.0)`** (style inline).
- **`transform-origin`** par défaut = **`50% 50%`** (centre).
- Donc le zoom se fait depuis le **centre** de l’image : elle grandit vers la **gauche** et la **droite** (et haut/bas) de la même façon.

Conséquence :
- La **boîte de layout** de l’image ne change pas (le layout ne tient pas compte du scale).
- En revanche, le **rendu visuel** est 2× plus large ; le bord gauche **visuel** est décalé vers la gauche par rapport au bord gauche de la boîte.
- Ce décalage fait que le logo **déborde visuellement** dans la zone de marge (padding) et donne l’impression d’être « à l’extrême gauche ».

### Aucun conflit structurel
- Pas de `position: absolute` qui sortirait le logo du flux.
- Pas de margin/padding négatifs sur `.header-logo` (règles explicites `margin-left: 0; padding-left: 0`).
- Pas de classe Tailwind `pl-0` / `px-0` sur le `content-wrap` de la navbar.
- TopInfoBar et Footer utilisent le même `.content-wrap` ; seul le logo a ce scale.

---

## 4. Correction appliquée

Pour que le logo **respecte visuellement** la marge tout en gardant `scale(2.0)` :

- Quand le logo est aligné à gauche (**`align="left"`**, cas navbar), utiliser **`transform-origin: left center`** sur l’image.
- Ainsi le scale agrandit le logo vers la **droite** (et haut/bas) sans le faire dépasser vers la **gauche** : le bord gauche visuel reste aligné sur le bord gauche de la boîte = sur la marge du `content-wrap`.

Modification dans **`src/components/Logo.tsx`** :  
ajout de `transformOrigin: 'left center'` dans le `style` de l’`img` lorsque `align === 'left'`.

---

## 5. Synthèse

| Élément                    | Statut |
|---------------------------|--------|
| Marge définie (variables + .content-wrap) | OK |
| Navbar utilise .content-wrap              | OK |
| header .content-wrap renforcé en CSS      | OK |
| Logo dans le flux (pas en absolute)       | OK |
| **Cause du visuel « à l’extrême gauche »** | **transform: scale(2) avec origin au centre → débordement visuel à gauche** |
| **Correction**                             | **transform-origin: left center quand align="left"** |
