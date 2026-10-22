// Biblioteka ilustracji SVG do relacji bez zdjęcia (viewBox 0 0 1000 1000).
// motyw(nazwa, kolory) -> '<svg ...>'. Kolory: {acc, ink, soft, dark, bg2}.
// Własna ilustracja: spec.svg = wnętrze <svg> (viewBox 0 0 1000 1000) z tokenami {acc} {ink} {soft} {dark} {bg2}.
const S = (inner, c) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="100%" height="100%">${inner
  .replace(/\{acc\}/g, c.acc).replace(/\{ink\}/g, c.ink).replace(/\{soft\}/g, c.soft).replace(/\{dark\}/g, c.dark).replace(/\{bg2\}/g, c.bg2)}</svg>`;

const arc = (cx, cy, r, a1, a2) => {
  const p = a => [cx + r * Math.cos(a * Math.PI / 180), cy + r * Math.sin(a * Math.PI / 180)];
  const [x1, y1] = p(a1), [x2, y2] = p(a2);
  return `M${x1.toFixed(1)} ${y1.toFixed(1)} A${r} ${r} 0 ${Math.abs(a2 - a1) > 180 ? 1 : 0} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
};
const wave = (y, amp, len, ph) => { let d = `M-20 ${y}`; for (let x = -20; x <= 1020; x += 10) d += ` L${x} ${(y + amp * Math.sin((x / len) * 2 * Math.PI + ph)).toFixed(1)}`; return d; };

const M = {
  // skala/wskaźnik: za nisko – optimum – za wysoko
  gauge: () => `<path d="${arc(500, 780, 420, 180, 240)}" stroke="{soft}" stroke-width="70" fill="none" opacity=".35"/>
    <path d="${arc(500, 780, 420, 242, 298)}" stroke="{acc}" stroke-width="70" fill="none"/>
    <path d="${arc(500, 780, 420, 300, 360)}" stroke="{soft}" stroke-width="70" fill="none" opacity=".35"/>
    <line x1="500" y1="780" x2="${500 + 360 * Math.cos(262 * Math.PI / 180)}" y2="${780 + 360 * Math.sin(262 * Math.PI / 180)}" stroke="{ink}" stroke-width="18" stroke-linecap="round"/>
    <circle cx="500" cy="780" r="46" fill="{ink}"/>`,
  // tarcza i strzała – cel, koncentracja
  target: () => [380, 290, 200, 110].map((r, i) => `<circle cx="470" cy="530" r="${r}" fill="${i % 2 ? '{bg2}' : 'none'}" stroke="${i === 3 ? '{acc}' : '{soft}'}" stroke-width="${i === 3 ? 60 : 26}" opacity="${i === 3 ? 1 : .55}"/>`).join('')
    + `<circle cx="470" cy="530" r="34" fill="{acc}"/><line x1="470" y1="530" x2="900" y2="120" stroke="{ink}" stroke-width="16" stroke-linecap="round"/>
    <path d="M900 120 l-70 10 l60 60 z" fill="{ink}"/><path d="M470 530 l40 -10 l-12 40 z" fill="{ink}"/>`,
  // fale – emocje, oddech, pobudzenie
  waves: () => [0, 1, 2, 3, 4].map(i => `<path d="${wave(300 + i * 110, 60 - i * 8, 380 + i * 60, i)}" stroke="${i === 2 ? '{acc}' : '{soft}'}" stroke-width="${i === 2 ? 22 : 12}" fill="none" opacity="${i === 2 ? 1 : .45}" stroke-linecap="round"/>`).join(''),
  // schody – rozwój krok po kroku
  stairs: () => [0, 1, 2, 3, 4].map(i => `<rect x="${110 + i * 160}" y="${780 - i * 130}" width="160" height="${140 + i * 130}" fill="${i === 4 ? '{acc}' : '{soft}'}" opacity="${i === 4 ? 1 : .25 + i * .12}"/>`).join('')
    + `<circle cx="830" cy="190" r="46" fill="{ink}"/><path d="M830 240 v110" stroke="{ink}" stroke-width="24" stroke-linecap="round"/>`,
  // kręta droga do flagi – proces, cierpliwość
  path: () => `<path d="M150 920 C 650 860, 250 640, 600 560 S 450 300, 760 230" stroke="{soft}" stroke-width="70" fill="none" opacity=".35" stroke-linecap="round"/>
    <path d="M150 920 C 650 860, 250 640, 600 560 S 450 300, 760 230" stroke="{ink}" stroke-width="8" stroke-dasharray="30 30" fill="none"/>
    <line x1="760" y1="230" x2="760" y2="70" stroke="{ink}" stroke-width="14"/><path d="M766 74 h150 l-40 45 l40 45 h-150 z" fill="{acc}"/>
    <circle cx="150" cy="920" r="30" fill="{acc}"/>`,
  // waga – równowaga, wymagania, życie i sport
  scale: () => `<line x1="500" y1="170" x2="500" y2="860" stroke="{ink}" stroke-width="22"/><rect x="330" y="850" width="340" height="40" rx="20" fill="{ink}"/>
    <line x1="170" y1="330" x2="830" y2="250" stroke="{ink}" stroke-width="20" stroke-linecap="round"/><circle cx="500" cy="290" r="34" fill="{acc}"/>
    <path d="M170 330 l-90 230 h180 z M830 250 l-90 230 h180 z" fill="none" stroke="{soft}" stroke-width="8" opacity=".7"/>
    <path d="M60 560 a110 50 0 0 0 220 0 z" fill="{acc}"/><path d="M720 480 a110 50 0 0 0 220 0 z" fill="{soft}" opacity=".6"/>`,
  // góra z flagą – cel, wyzwanie
  mountain: () => `<path d="M40 900 L380 330 L520 520 L640 380 L960 900 Z" fill="{soft}" opacity=".3"/>
    <path d="M380 330 L300 465 L350 440 L390 480 L440 430 Z" fill="{ink}" opacity=".85"/>
    <path d="M40 900 L380 330 L520 520" stroke="{ink}" stroke-width="10" fill="none"/>
    <line x1="380" y1="330" x2="380" y2="170" stroke="{ink}" stroke-width="12"/><path d="M386 174 h130 l-34 38 l34 38 h-130 z" fill="{acc}"/>`,
  // dwie połowy – wewnętrzny głos, myśli, dwie strony
  split: () => `<circle cx="500" cy="520" r="360" fill="{soft}" opacity=".25"/><path d="M500 160 a360 360 0 0 1 0 720 z" fill="{acc}"/>
    <circle cx="500" cy="340" r="180" fill="{acc}"/><circle cx="500" cy="700" r="180" fill="{bg2}"/>
    <circle cx="500" cy="340" r="50" fill="{bg2}"/><circle cx="500" cy="700" r="50" fill="{acc}"/>`,
  // klepsydra – czas, cierpliwość, presja czasu
  hourglass: () => `<rect x="250" y="110" width="500" height="40" rx="20" fill="{ink}"/><rect x="250" y="850" width="500" height="40" rx="20" fill="{ink}"/>
    <path d="M300 150 C300 400 470 430 470 500 C470 570 300 600 300 850 H700 C700 600 530 570 530 500 C530 430 700 400 700 150 Z" fill="none" stroke="{ink}" stroke-width="14"/>
    <path d="M360 260 H640 C620 380 520 420 500 480 C480 420 380 380 360 260 Z" fill="{soft}" opacity=".5"/>
    <path d="M500 500 V780" stroke="{acc}" stroke-width="8" stroke-dasharray="4 14"/><path d="M330 840 C400 700 600 700 670 840 Z" fill="{acc}"/>`,
  // puls/EKG – stres, ciało, emocje
  pulse: () => `<path d="M20 520 H300 L360 380 L430 700 L500 220 L570 760 L630 520 H980" stroke="{acc}" stroke-width="24" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M20 520 H980" stroke="{soft}" stroke-width="4" opacity=".35"/>`
    + [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => `<line x1="${60 + i * 110}" y1="200" x2="${60 + i * 110}" y2="840" stroke="{soft}" stroke-width="3" opacity=".18"/>`).join(''),
  // kompas – kierunek, wartości, decyzje
  compass: () => `<circle cx="500" cy="500" r="380" fill="none" stroke="{ink}" stroke-width="16"/><circle cx="500" cy="500" r="330" fill="none" stroke="{soft}" stroke-width="4" opacity=".5"/>`
    + [0, 45, 90, 135, 180, 225, 270, 315].map(a => `<line x1="${500 + 330 * Math.cos(a * Math.PI / 180)}" y1="${500 + 330 * Math.sin(a * Math.PI / 180)}" x2="${500 + 375 * Math.cos(a * Math.PI / 180)}" y2="${500 + 375 * Math.sin(a * Math.PI / 180)}" stroke="{ink}" stroke-width="10"/>`).join('')
    + `<path d="M500 160 L570 500 L500 840 L430 500 Z" fill="{soft}" opacity=".4"/><path d="M500 160 L570 500 H430 Z" fill="{acc}"/><circle cx="500" cy="500" r="28" fill="{ink}"/>`,
  // słupki – postęp, wyniki, porównania
  bars: () => [260, 390, 330, 520, 610].map((h, i) => `<rect x="${120 + i * 160}" y="${880 - h}" width="110" height="${h}" rx="14" fill="${i === 4 ? '{acc}' : '{soft}'}" opacity="${i === 4 ? 1 : .35}"/>`).join('')
    + `<path d="M150 600 L330 470 L490 530 L650 340 L820 230" stroke="{ink}" stroke-width="12" fill="none" stroke-linecap="round"/><circle cx="820" cy="230" r="26" fill="{ink}"/><line x1="80" y1="890" x2="940" y2="890" stroke="{ink}" stroke-width="8"/>`,
  // kropki: jedna wyróżniona – ja na tle innych, porównywanie się
  dots: () => { let s = ''; for (let r = 0; r < 7; r++) for (let c = 0; c < 7; c++) { const on = r === 3 && c === 4; s += `<circle cx="${140 + c * 120}" cy="${140 + r * 120}" r="${on ? 52 : 30}" fill="${on ? '{acc}' : '{soft}'}" opacity="${on ? 1 : .35}"/>`; } return s; },
  // bateria – energia, regeneracja, zmęczenie
  battery: () => `<rect x="190" y="300" width="560" height="400" rx="50" fill="none" stroke="{ink}" stroke-width="26"/><rect x="760" y="420" width="60" height="160" rx="14" fill="{ink}"/>`
    + [0, 1, 2, 3].map(i => `<rect x="${235 + i * 128}" y="345" width="104" height="310" rx="16" fill="${i < 2 ? '{acc}' : '{soft}'}" opacity="${i < 2 ? 1 : .2}"/>`).join('')
    + `<path d="M520 180 L440 330 H520 L470 470" stroke="{acc}" stroke-width="0" fill="none"/>`,
  // nawias / dymek – rozmowa, komunikacja, wewnętrzny dialog
  bubbles: () => `<path d="M120 200 h520 a60 60 0 0 1 60 60 v260 a60 60 0 0 1 -60 60 h-330 l-110 100 v-100 h-80 a60 60 0 0 1 -60 -60 v-260 a60 60 0 0 1 60 -60 z" fill="{soft}" opacity=".3"/>
    <path d="M420 460 h460 a60 60 0 0 1 60 60 v220 a60 60 0 0 1 -60 60 h-60 v90 l-100 -90 h-300 a60 60 0 0 1 -60 -60 v-220 a60 60 0 0 1 60 -60 z" fill="{acc}"/>
    <circle cx="560" cy="630" r="22" fill="{dark}"/><circle cx="650" cy="630" r="22" fill="{dark}"/><circle cx="740" cy="630" r="22" fill="{dark}"/>`,
  // lustro/odbicie – samoocena, mocne strony
  mirror: () => `<ellipse cx="500" cy="440" rx="270" ry="350" fill="{bg2}" stroke="{ink}" stroke-width="22"/><rect x="470" y="790" width="60" height="120" fill="{ink}"/><rect x="360" y="900" width="280" height="30" rx="15" fill="{ink}"/>
    <path d="M360 250 L460 180 M330 360 L520 220" stroke="{soft}" stroke-width="16" stroke-linecap="round" opacity=".6"/>
    <path d="M500 560 l30 62 l68 10 l-49 48 l12 68 l-61 -32 l-61 32 l12 -68 l-49 -48 l68 -10 z" fill="{acc}"/>`,
};
const motyw = (name, c, custom) => S(custom || (M[name] ? M[name]() : M.waves()), c);
module.exports = { motyw, MOTYWY: Object.keys(M) };
