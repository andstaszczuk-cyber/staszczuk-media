# Relacje IG z metaforami (@psychologsportu)

Jedna relacja dziennie, 19:30 Europe/Warsaw, przez Metricool (brand 7496128, instagram, type STORY).

- `kolejka.json` – metafory Andrzeja z sesji (bez danych zawodników). `uzyta` = data publikacji albo null.
- `zdjecia/` + `zdjecia.json` – zdjęcia Andrzeja (kolor i cz-b, opis, orientacja).
- `relacje/RRRR-MM-DD.json` – spec grafiki, `relacje/RRRR-MM-DD.png` – gotowa relacja.
- `log.json` – historia: data, id metafory, layout, zdjęcie, paleta, font.
- Render: `cd tools && npm install --no-audit --no-fund && node metafora.js ../metafory/relacje/X.json ../metafory/relacje/X.png`
- Layouty L1–L12, palety red|black|cream|mono, fonty raj|anton|bebas|playfair, focus 0–100 (pionowe położenie kadru), tilt -4..4.
- W headline/body `*słowa*` = wyróżnienie akcentem. Bez cudzysłowów i hashtagów.

Zasada niepowtarzalności: kombinacja (layout, zdjęcie, paleta, font) nigdy się nie powtarza; layout inny niż w 5 ostatnich dniach, zdjęcie (numer) inne niż w 3 ostatnich, paleta inna niż wczoraj.
