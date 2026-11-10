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

## Grafiki bez zdjęcia (od 22.10.2026)
Andrzej chce, żeby relacje nie były tylko z jego zdjęciem, ale też z grafikami stworzonymi od zera.
- Layouty G1–G8 (tools/metafora.js) bez zdjęcia: G1 ilustracja u góry, G2 wielka przygaszona ilustracja w tle, G3 pełne tło w kolorze akcentu, G4 ukośny blok z ilustracją, G5 kropki + karta, G6 ilustracja z rogu, G7 ramka, G8 panel akcentu po lewej.
- `art`: motyw z tools/motywy.js (gauge, target, waves, stairs, path, scale, mountain, split, hourglass, pulse, compass, bars, dots, battery, bubbles, mirror) dobrany do treści, ALBO `svg`: własna ilustracja (wnętrze <svg> 1000x1000, proste płaskie kształty, tokeny kolorów {acc} {ink} {soft} {dark} {bg2}, bez tekstu w ilustracji, bez postaci i logotypów).
- W logach pole photo = art:<motyw> albo svg:<krótka nazwa>; kombinacja (layout, photo, paleta, font) liczy się tak samo.
- Proporcja: w każdej serii co najmniej co druga relacja to grafika G1–G8 (nigdy dwie relacje ze zdjęciem z rzędu w serii), a w ciągu dnia z trzech relacji co najmniej jedna jest grafiką i co najmniej jedna ze zdjęciem. Ten sam motyw nie częściej niż raz na 5 dni we wszystkich seriach; co kilka dni narysuj własny svg.

## Jak pisać Myśl dnia i inne relacje z sesji (poprawki Andrzeja 3.11.2026, obowiązkowe)

Andrzej poprawił 10 relacji z serii Myśl dnia. Wnioski, które stosujesz w każdej relacji z jego myślami:

1. Pełne zdania, które tłumaczą, zamiast krótkich haseł i puent. Unikaj ucinanych zdań typu: Odwróć to. / Dostępne nie znaczy wdrożone. Lepiej: To, że wiesz, co zrobić, nie znaczy, że to robisz.
2. Najpierw nazwij myśl albo zachowanie odbiorcy jego słowami (Myślisz za dużo o tym, co będzie robił rywal…?), potem pokaż, co zamiast tego (Skup się na tym, jaką inicjatywę chcesz zrobić, i jak to on będzie musiał się dopasować do ciebie).
3. Dopowiedz przyczynę i daj łagodny, konkretny krok: To zasługa nawyków, które są silniejsze niż świadomość. Nie bądź dla siebie okrutny, po prostu krok po kroku zmieniaj zachowanie.
4. Zwykłe słowa zamiast wymyślnych i metafor walki: nie neutralizujesz, nie kręcisz bicza, nie walczysz, tylko rywalizujesz, zmieniasz, robisz.
5. Konkret z życia zamiast ogólnika: siedemnaście rozwiązań w ChatGPT, nie: jednym kliknięciem.
6. Kontrast z przekonaniem odbiorcy: …a tobie się wydaje, że to precyzyjna ocena sytuacji.
7. Zamiast samego: nie rób najwięcej, powiedz, co robić: rób to, co jest sensowne, właściwe i naprawdę daje progres.
8. Można mówić wprost: powinieneś się resetować; jutro idę dalej robić swoje zadania.
9. Uczciwie o koszcie: na początku zawsze będzie średnio, ale taka jest cena dobrej roboty w dalszym etapie.
10. Body może mieć do ok. 200 znaków, jeśli dzięki temu myśl jest zrozumiała. Wyróżnienie w *gwiazdkach* daj na zdanie z rozwiązaniem.

Wzorce poprawione przez Andrzeja (przed → po):
- Każdy wie, co mu szkodzi, i robi dalej. Nawyk bywa silniejszy niż wiedza. Nie kręć na siebie bicza z tego, co już wiesz. → Każdy dobrze wie, co mu szkodzi, a mimo to robi to dalej. To zasługa nawyków, które są silniejsze niż świadomość. Nie bądź dla siebie okrutny za to, po prostu krok po kroku zmieniaj zachowanie.
- Nie masz robić najwięcej ze wszystkich. Masz robić tak, żeby to rosło. → Nie masz robić najwięcej ze wszystkich. Masz robić to, co jest sensowne, właściwe i naprawdę daje progres.
- Jeden słaby dzień nie jest wróżbą. Nie czytaj z niego prognozy na kolejne. Dziś było tak, idę dalej robić swoje. → Jeden słaby dzień nie jest wróżbą na przyszłość. Nie czytaj z niego prognozy na kolejne dni. Dziś było tak, a jutro idę dalej robić swoje zadania.

Kolejne poprawki Andrzeja (3.11.2026), reszta przerobionych tekstów zaakceptowana jako wzór:
11. Czasowniki z życia zamiast abstrakcyjnych rzeczowników: nie trudności i efekt, tylko męczysz się i udaje się. Wzór: Wiesz, ile sam się męczysz, ale u innych widzisz tylko to, że im się udaje.
12. Zamiast mądrych słów (intencje, dopisywać, interpretacja) mów jak w rozmowie: Często sami sobie wymyślamy, co ktoś miał na myśli. Forma my jest w porządku, gdy dotyczy wszystkich.
13. Wskazówka na końcu krótka i prosta: Zamiast zgadywać, po prostu zapytaj.

## Relacja: wolne terminy (od 10.11.2026)
Przy każdym przebiegu zadania przygotuj też relacje z wolnymi terminami według metafory/wolne_terminy/README.md (generator render.py), obejrzyj i wyślij Andrzejowi przez SendUserFile. Nie planuj w Metricool.
