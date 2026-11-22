# Relacje IG dla 4 marek: dwie myśli dnia (decyzja Andrzeja 20.11.2026)

Andrzej zatwierdził próbkę 20.11.2026. Każda marka ma codziennie DWIE relacje na Instagramie (tylko Instagram, type STORY): o 9:00 i o 19:30 Europe/Warsaw. Obie to myśli dnia w stylu relacji @psychologsportu (seria metafory/teksty), z treścią dopasowaną do profilu. Andrzej ma stałą zgodę na planowanie tych relacji w Metricool. Nie pytaj o potwierdzenie.

## Marki
| marka | blogId | podpis (handle) | palety | odbiorca i treść |
|---|---|---|---|---|
| sedzia | 7500529 | @sedziazglowa | s_red, s_yellow, s_dark | sędziowie piłkarscy: mecz, decyzje, błąd, trybuny, ławka, obserwator, kondycja, życie obok gwizdka |
| rodzina | 7500546 | @sportowarodzina | r_cream, r_khaki, r_white | rodzice młodych sportowców: rozmowy po meczu, trybuny, zmęczenie, szkoła i sport, emocje dziecka, rodzeństwo |
| psychologsportowy | 7523042 | @psychologsportowy | p_grafit, p_zolty | zawodnicy (młodzi i dorośli): stres, pewność siebie, koncentracja, cele, porażka, rutyny |
| madry | 7886501 | @madrysport.pl | m_ciemny, m_jasny, m_roz | młodzi sportowcy: ciało i głowa razem, sen, regeneracja, jedzenie (bez diet i liczb), rozgrzewka, emocje, szkoła |

## Grafika
- Renderer: `cd tools && node metafora.js spec.json out.png` (1080x1920). Wzór próbki: relacje-marki/wzor/*.json oraz ostatnie wpisy w relacje-marki/<marka>/.
- spec: {"layout":"G1".."G8","palette":<paleta marki>,"font":"raj|anton|bebas|playfair","art":<motyw>,"kicker":"2-3 słowa","headline":"krótko, jedno *wyróżnione* słowo lub fraza","body":"2-3 zdania","handle":<podpis>,"showHandle":true}
- Motywy art (tools/motywy.js): gauge, target, waves, stairs, path, scale, mountain, split, hourglass, pulse, compass, bars, dots, battery, bubbles, mirror. Dobieraj do treści. Możesz zamiast art podać "svg" (własna płaska ilustracja 1000x1000, tokeny {acc}{ink}{soft}{dark}{bg2}, bez tekstu, bez postaci).
- Różnorodność: w tym samym dniu obie relacje mają inny layout, paletę i font; layout inny niż w 3 poprzednich relacjach marki; kombinacja (layout, paleta, font, art) nie powtarza się w obrębie 14 dni.
- Obejrzyj każdą grafikę (Read, najlepiej siatki po 4-8 pomniejszonych): tekst się mieści, nic nie nachodzi na podpis na dole, polskie znaki. Za długi tekst skróć.

## Teksty
- Skill posty-andrzeja (wywołaj go). Brzmi jak Andrzej mówiący do odbiorcy marki, prosto, potocznie, krótkie zdania, bez żargonu.
- headline do ok. 40 znaków, body 1-3 zdania (do ok. 220 znaków).
- Zakazane: konstrukcje X, a nie Y; nie X, tylko Y; Nie X. Y; X, nie Y. Cudzysłowy, hashtagi, emoji, linki, dane zawodników. Po dwukropku mała litera.
- Temat każdej relacji inny niż wszystkie wcześniejsze relacje tej marki (log niżej) i inny niż karuzela tej marki z tego samego dnia (foldery sedzia/RRRR-MM-DD-*, rodzina/..., psychologsportowy/..., madry/plan.json). Może nawiązywać do pory roku i kalendarza (święta, ferie, sezon). Dzień tygodnia w tekście zgodny z datą.
- Historie o Andrzeju tylko te ze skilla.
- Otwarcia (zasada z 21.11.2026): Nie zaczynaj od Wyobraź sobie. To samo otwarcie (2-3 pierwsze słowa) najwyżej raz na 20 kolejnych postów marki; sprawdź otwarcia ostatnich 20 postów przed pisaniem.

## Pliki i log
- Folder: relacje-marki/<marka>/RRRR-MM-DD-0900.json|png i -1930.json|png.
- Log: relacje-marki/<marka>/log.json (lista: data, godzina, kicker, headline, layout, palette, font, art, metricool_id, uuid). Dopisuj po każdym zaplanowaniu.
- Commit tylko relacje-marki/<marka>/ (autor Andrzej Staszczuk <and.staszczuk@gmail.com>, stopka: Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com> i Claude-Session: https://claude.ai/code/session_01A5PTvWpyS7iEo6fG2kmJPS), `git pull --rebase --autostash`, push. Adresy: https://raw.githubusercontent.com/andstaszczuk-cyber/staszczuk-media/<sha>/relacje-marki/<marka>/<plik>.png, sprawdź curl -r 0-9 (200 lub 206).

## Metricool
- Najpierw sprawdź getScheduledPosts marki w krótkich oknach (5-7 dni): czy w danym dniu nie ma już relacji (instagramData.type STORY) o 9:00 lub 19:30. Jeśli o tej godzinie jest już relacja, nie dubluj (pomiń ten slot). Jeśli w dniu są inne relacje marki (np. seria Mądrego Sportu z dopiskiem Cały post na profilu albo relacje lead Rodziny w niedzielę o 19:00), zostaw je i zanotuj w podsumowaniu.
- createScheduledPost: blogId marki, providers [{network: instagram}], instagramData {type: STORY, isAiGenerated: false}, media [adres png], bez text, autoPublish true, draft false, publicationDate {dateTime: RRRR-MM-DDT09:00:00 lub T19:30:00, timezone: Europe/Warsaw}.
- Przy timeout mediów: sprawdź, czy wpis nie powstał, i ponów raz.
- Metricool zwraca strefę Europe/Madrid: to ten sam czas, nie poprawiaj.

## Na koniec
Krótkie podsumowanie po polsku, po ludzku: marka, zakres dat, ile relacji, przykładowe tematy, co pominięto i dlaczego, błędy.
