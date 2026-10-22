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

## Druga seria: myśli Andrzeja (12:30)
- `teksty_kolejka.json` – 1222 teksty z Bank_tekstow_Andrzej.xlsx (format relacja/oba, ocena ≥2, bez analogii, bez pozycji do sprawdzenia, bez pokrywających się z metaforami), plus nowe z Zoom (`zrodlo: zoom RRRR-MM-DD`).
- `teksty/RRRR-MM-DD.json|png`, `teksty_log.json` – jak w serii metafor.
- `zoom_rejestr.json` – przetworzone spotkania Zoom (uuid) i `ostatnio_do`.
- Niepowtarzalność liczona łącznie z `log.json` (seria metafor): kombinacja nigdy dwa razy, w tym samym dniu obie relacje mają inny layout, zdjęcie i paletę.

## Trzecia seria: wpisy z bloga (17:00)
- Jedna relacja dziennie o jednym wpisie z https://andrzejstaszczuk.pl/blog/ (najpierw najnowszy jeszcze niepromowany, potem po kolei starsze; po wyczerpaniu powtórka najdawniej promowanego, nie wcześniej niż 60 dni od poprzedniej, z nowym tekstem i projektem).
- `blog/RRRR-MM-DD.json|png`, `blog_log.json` (data, url, tytul_wpisu, layout, photo, palette, font, ...).
- Pole `cta` w spec (np. Cały tekst: andrzejstaszczuk.pl/blog) – renderer dokleja pigułkę pod tekstem (ctaPos inline; top/bottom + ctaStyle pill|bar|tag tylko gdy inline nie pasuje).
- Niepowtarzalność liczona łącznie z log.json i teksty_log.json; w tym samym dniu trzy relacje mają różny layout, zdjęcie i paletę.
