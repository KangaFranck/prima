# Polices Bal Harbour Shops (Ogg Roman + Sofia Pro)

Pour avoir **exactement** le même rendu que la référence, dépose ici les fichiers de polices **après achat de licence**.

## Où les acheter

### Ogg Roman (titres – serif type Didot/Bodoni)
- **Commercial Type** : https://commercialtype.com/catalog  
- **Sharp Type** : https://sharptype.co (Ogg par Lucas Sharp)  
→ Choisir la licence **webfont** et télécharger les fichiers `.woff2` (ou `.woff`).

### Sofia Pro (corps de texte – sans-serif)
- **MyFonts** : https://www.myfonts.com/products/sofia-pro-complete-family-package-1041789/  
- **Fontspring** : https://www.fontspring.com/fonts/mostardesign/sofia-pro  
→ Licence **webfont** ; télécharger au minimum Light (300), Regular (400), Medium (500).

---

## Fichiers à placer dans ce dossier

Renommez si besoin pour correspondre exactement à ces noms :

| Rôle        | Fichier(s) attendu(s) |
|------------|------------------------|
| **Ogg Roman** | `OggRoman-Regular.woff2` (obligatoire), optionnel : `OggRoman-Medium.woff2`, `OggRoman-Bold.woff2` |
| **Sofia Pro** | `SofiaPro-Light.woff2`, `SofiaPro-Regular.woff2`, `SofiaPro-Medium.woff2` |

Si vos fichiers ont d’autres noms (ex. `Ogg-Roman.woff2`, `Sofia Pro Light.woff2`), renommez-les comme ci‑dessus **ou** adaptez les chemins dans `src/index.css` (déclarations `@font-face`).

Une fois les fichiers en place, le site utilisera automatiquement Ogg Roman pour les titres et Sofia Pro pour le corps de texte.
