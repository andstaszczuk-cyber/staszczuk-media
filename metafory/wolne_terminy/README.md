# Relacja IG: wolne terminy (kształt zatwierdzony przez Andrzeja 10.11.2026)

- Dane: Calendly, event type Sesja indywidualna (60 min): https://api.calendly.com/event_types/CDHMRTLC2RZVXYXY, event_types-list_event_type_available_times, od teraz na ok. 2 tygodnie. Godziny przeliczyć z UTC na Europe/Warsaw (zapis 7:55, 17:15, bez zera z przodu).
- Dwie relacje 1080x1920: (1) najbliższe dni, tytuł Wolne terminy w tym tygodniu; (2) kolejne dni, tytuł Wolne terminy w kolejnych dniach. Maks. 6 wierszy (dni) na relację, dzień + data (np. czwartek 12.11), pigułki z godzinami.
- Bez adresu Calendly, bez zdania o bezpłatnym spotkaniu, tylko @psychologsportu na dole. Czerwone tło, żółty akcent, Lato.
- Render: python3 -I render.py spec.json wyjscie.png (format spec w nagłówku render.py). Po renderze obejrzeć obraz Read.
- Dostarczenie: SendUserFile obu plików (bez planowania w Metricool, chyba że Andrzej poprosi). Zapis kopii do psychologsportu/relacje/RRRR-MM-DD-wolne-terminy.png i -2.png.
- Andrzej bywa zajęty poza kalendarzem Calendly (np. 12.11 o 7:55): jeśli poda wyłączenia, usuń te godziny.
