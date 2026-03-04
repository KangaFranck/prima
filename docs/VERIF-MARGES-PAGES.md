# Vérification des marges sur tout le site

## Marge définie (CSS)

- **Variables** : `--page-margin` (1.5rem / 2rem / 2.5rem) → `--content-px` (responsive).
- **Classes** :
  - **`.content-wrap`** : padding gauche/droite + max-width 1536px, centré. Pour les blocs de contenu (texte, grilles, etc.).
  - **`.content-edge`** : même padding gauche/droite, sans max-width. Pour les sections pleine largeur qui doivent quand même respecter la marge (hero, bandeaux).

---

## Composants globaux (header / footer)

| Composant     | Classe utilisée   | Statut |
|---------------|-------------------|--------|
| TopInfoBar    | `content-wrap`    | OK     |
| Navbar        | `content-wrap`    | OK (+ règle `header .content-wrap`) |
| Footer        | `content-wrap`    | OK (2 blocs : contenu + copyright) |

---

## Pages publiques (contenu principal)

| Page / composant        | Contenu principal                    | Statut |
|-------------------------|--------------------------------------|--------|
| **Home**                | Hero overlay + mini vidéos           | OK (passé en `content-edge`) |
| **Home**                | Section "NOS UNIVERS" + carousel     | OK (`content-wrap`) |
| **APropos**             | 2 blocs texte                        | OK (`content-wrap`) |
| **ServicesInfo**        | 3 blocs                              | OK (`content-wrap`) |
| **Boutiques**           | Liste + grille                       | OK (`content-wrap`) |
| **Restaurants**         | Liste + grille                       | OK (`content-wrap`) |
| **Loisirs**             | Liste + grille                       | OK (`content-wrap`) |
| **ActusEvents**         | Liste actualités/événements          | OK (`content-wrap`) |
| **evenements/[id]**     | Détail événement                     | OK (`content-wrap`) |
| **CommerceDetailView**  | Barre retour + détail boutique/resto/loisir | OK (`content-wrap` barre + bloc contenu) |

---

## Composants réutilisables (sections)

| Composant | Usage                    | Statut |
|-----------|--------------------------|--------|
| Shops     | Grille boutiques (Home)  | OK (`content-wrap`) |
| Features  | Section features (Home)  | OK (`content-wrap`) |
| Stats     | Chiffres (Home)         | OK (`content-wrap`) |

---

## Pages avec layout spécifique (hors marge site)

- **boutiques/[id], restaurants/[id], loisirs/[id]** : chargement / erreur en plein écran (`px-4` centré). Contenu réel = **CommerceDetailView** → utilise `content-wrap`.
- **Login** : page centrée (`px-4 sm:px-6 lg:px-8`) pour le formulaire. Pas alignée sur la marge du site (choix de page dédiée).
- **Admin** (AdminLayout, Settings, etc.) : interface admin, marges propres. Pas la marge “site public”.

---

## Modifications effectuées lors de la vérification

1. **Home.tsx**
   - Overlay hero : `px-4 sm:px-6 md:px-8` → **`content-edge`** (même marge que navbar/footer).
   - Conteneur des mini vidéos : **`content-edge`** sur le wrapper, suppression du `px-4` sur la grille.

2. **CommerceDetailView.tsx**
   - Barre retour : `px-4 py-3 md:px-8` → **`content-wrap`**.
   - Bloc détail : `px-4 pt-12 md:px-8` → **`content-wrap`** + div interne `max-w-5xl mx-auto` pour limiter la largeur du texte.

---

## Récapitulatif

- **Header (TopInfoBar + Navbar)** et **Footer** utilisent la marge (`.content-wrap` / `header .content-wrap`).
- **Toutes les pages publiques** listées ci-dessus utilisent **`.content-wrap`** ou **`.content-edge`** pour le contenu principal, donc la marge est bien respectée sur l’ensemble du site.
