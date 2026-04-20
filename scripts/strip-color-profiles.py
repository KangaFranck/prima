#!/usr/bin/env python3
"""
strip-color-profiles.py

Nettoie les profils couleur embarques (ICC, sRGB, gAMA, cHRM, EXIF) des images
du dossier public/images afin que Safari et Chrome lisent les memes pixels bruts.

Pourquoi : Safari (ColorSync) applique les profils ICC/gAMA embarques, alors que
Chrome les ignore souvent. Supprimer ces chunks garantit un rendu identique
cross-navigateur sans modifier les couleurs visuelles de l'image.

Usage :
    python3 scripts/strip-color-profiles.py              # applique sur public/images
    python3 scripts/strip-color-profiles.py --dry-run    # simule sans ecrire

Dependance : Pillow (pip install Pillow)
"""
from __future__ import annotations

import argparse
import io
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Pillow n'est pas installe. Lance : pip install Pillow", file=sys.stderr)
    sys.exit(1)

ROOT = Path(__file__).resolve().parent.parent
TARGET_DIR = ROOT / "public" / "images"
EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp"}


def strip_image(path: Path, dry_run: bool = False, only_with_profiles: bool = True) -> tuple[bool, str]:
    """Re-ecrit l'image sans aucune metadonnee de profil couleur.

    Si only_with_profiles est True (defaut), on ignore les images qui n'ont
    aucun chunk ICC/sRGB/gAMA (pas besoin de re-encoder inutilement).
    """
    try:
        original = path.read_bytes()
    except OSError as e:
        return False, f"lecture impossible ({e})"

    try:
        with Image.open(io.BytesIO(original)) as im:
            im.load()
            had_icc = bool(im.info.get("icc_profile"))
            has_srgb = "srgb" in im.info
            has_gamma = "gamma" in im.info

            # Ne rien faire si aucun profil a retirer (preserver l'encodage original)
            if only_with_profiles and not (had_icc or has_srgb or has_gamma):
                return True, "aucun profil a retirer (ignore)"

            # Preparer les pixels en mode natif (pas de conversion de palette)
            mode = im.mode
            data = list(im.getdata())
            size = im.size

            # Nouvelle image : pas de im.info, donc pas de chunks sRGB/gAMA/iCCP
            new_im = Image.new(mode, size)
            new_im.putdata(data)

            buf = io.BytesIO()
            ext = path.suffix.lower()
            if ext == ".png":
                new_im.save(buf, format="PNG", optimize=True)
            elif ext in (".jpg", ".jpeg"):
                # Convertir RGBA -> RGB si besoin (JPEG ne gere pas l'alpha)
                if new_im.mode in ("RGBA", "LA"):
                    bg = Image.new("RGB", new_im.size, (255, 255, 255))
                    bg.paste(new_im, mask=new_im.split()[-1])
                    new_im = bg
                new_im.save(buf, format="JPEG", quality=92, optimize=True, progressive=True)
            elif ext == ".webp":
                new_im.save(buf, format="WEBP", quality=92)
            else:
                return False, f"extension non geree : {ext}"

            new_bytes = buf.getvalue()
            flags = []
            if had_icc:
                flags.append("ICC")
            if has_srgb:
                flags.append("sRGB")
            if has_gamma:
                flags.append("gAMA")
            removed = ",".join(flags) if flags else "rien"

            if not dry_run:
                path.write_bytes(new_bytes)

            size_before = len(original)
            size_after = len(new_bytes)
            delta_pct = ((size_after - size_before) / size_before * 100) if size_before else 0
            return True, f"{size_before}o -> {size_after}o ({delta_pct:+.1f}%) [strip: {removed}]"
    except Exception as e:
        return False, f"erreur Pillow ({e})"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dry-run", action="store_true", help="ne rien ecrire, simuler")
    parser.add_argument("--path", default=str(TARGET_DIR), help=f"dossier cible (defaut : {TARGET_DIR})")
    parser.add_argument("--all", action="store_true", help="re-encoder aussi les images sans profil (risque taille)")
    args = parser.parse_args()

    target = Path(args.path)
    if not target.exists():
        print(f"Dossier introuvable : {target}", file=sys.stderr)
        return 1

    files = sorted(p for p in target.rglob("*") if p.is_file() and p.suffix.lower() in EXTENSIONS)
    if not files:
        print(f"Aucune image trouvee dans {target}")
        return 0

    print(f"\nNettoyage des profils couleur dans : {target}")
    if args.dry_run:
        print("(mode dry-run : aucune ecriture)\n")
    else:
        print()

    ok = 0
    fail = 0
    for f in files:
        rel = f.relative_to(ROOT)
        success, info = strip_image(f, dry_run=args.dry_run, only_with_profiles=not args.all)
        tag = "OK  " if success else "FAIL"
        print(f"  {tag} {rel}  {info}")
        if success:
            ok += 1
        else:
            fail += 1

    print(f"\nTermine : {ok} image(s) re-encodee(s), {fail} echec(s).")
    if args.dry_run:
        print("Relance sans --dry-run pour appliquer.")
    return 0 if fail == 0 else 2


if __name__ == "__main__":
    sys.exit(main())
