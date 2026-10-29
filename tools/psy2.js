// psy2.js: karuzele @psychologsportowy v2 (1080x1350, 5 slajdów) z ilustracjami i wizualizacjami.
// psy.js zostaje bez zmian (stary styl). Ten renderer: okładka z dużą ilustracją, slajdy 2-4 z wizualizacją myśli.
//
// UŻYCIE:  node psy2.js spec.json outDir      -> outDir/1.png .. 5.png
//
// FORMAT SPEC (JSON):
// {
//   "theme": "grafit" | "zolty",             // kolor okładki; slajdy 2-5 dostają ten sam motyw
//   "cover": {
//     "layout": "hero" | "top" | "split" | "big",
//        hero  = ilustracja u góry (ok. połowa kadru) + tytuł na dole
//        top   = tytuł u góry + scena/schemat na dole
//        split = podział na pół (przed/po), etykiety left/right, tytuł na dole
//        big   = duża liczba albo hasło ("big") + mały rysunek obok
//     "kicker": "PERFEKCJONIZM",            // mały nadtytuł (opcjonalny)
//     "title": "Wygrałeś, a w głowie\n*lista błędów*",   // \n = nowa linia, *słowo* = wyróżnienie, _tekst_ = kursywa (cytat)
//     "sub": "Tak działa perfekcjonizm",     // opcjonalny podtytuł
//     "pre": "Na treningu wychodzi.",        // opcjonalna przekreślona linia nad tytułem (stare przekonanie)
//     "size": 100, "artTop": 110, "artH": 600, "titleTop": 770,   // opcjonalne korekty układu (px)
//     "art": { "type": "<nazwa z ART>", ...parametry },  // ilustracja okładki (obowiązkowa)
//     "left": "TRENING", "right": "ZAWODY",  // tylko split
//     "big": "3"                             // tylko big
//   },
//   "points": [                              // dokładnie 3 slajdy (2..4)
//     { "title": "Najpierw to, co wyszło", "body": "1-2 zdania", "viz": { "type": "<nazwa z VIZ>", ...parametry } }
//   ],
//   "end": { "question": "Za co możesz się *docenić*?", "cta": "Zapisz i wróć ...", "art": "think" | "bubble" }
// }
// ART (okładki, 900x620): podium, coachGap, splitPressure, curve
// VIZ (slajdy, 900x540): checklist{items,back}, timer{min}, cake, guessVsAsk{guesses,ask},
//   moment{bad,good}, targets{left,right}, scale{left,right,weights}, meter{from,to,top,chips}, same{left,right,items}
// Teksty: min. 38px treść, 64px+ tytuły; polskie znaki z Poppins latin-ext; bez cudzysłowów (cytat = kursywa _..._).
const fs = require('fs');
const path = require('path');
const F = p => 'file://' + path.join(__dirname, 'node_modules/@fontsource/poppins/files', p);
const ff = (w, it = '') => `@font-face{font-family:P;font-weight:${w};${it ? 'font-style:italic;' : ''}src:url(${F(`poppins-latin-ext-${w}-${it || 'normal'}.woff2`)});unicode-range:U+0100-024F,U+1E00-1EFF}
@font-face{font-family:P;font-weight:${w};${it ? 'font-style:italic;' : ''}src:url(${F(`poppins-latin-${w}-${it || 'normal'}.woff2`)})}`;
const FONT = [ff(800), ff(700), ff(600), ff(500), ff(600, 'italic'), ff(800, 'italic')].join('\n');

const Y = '#FCE86A', INK = '#151515';
const TH = {
  grafit: { bg: 'radial-gradient(120% 85% at 50% 32%,#4a4a4f 0%,#2c2c30 42%,#1a1a1d 100%)', fg: '#fff', A: Y, onA: INK,
    mute: 'rgba(255,255,255,.62)', soft: 'rgba(255,255,255,.22)', faint: 'rgba(255,255,255,.08)', line: 'rgba(255,255,255,.16)',
    card: 'rgba(255,255,255,.07)', cardS: 'rgba(255,255,255,.14)', fig: '#fff', fig2: '#8d8d94', paper: '#fff', paperInk: INK },
  zolty: { bg: 'radial-gradient(120% 85% at 50% 30%,#fff1a0 0%,#FCE86A 45%,#f3d94c 100%)', fg: INK, A: INK, onA: Y,
    mute: 'rgba(21,21,21,.66)', soft: 'rgba(21,21,21,.22)', faint: 'rgba(21,21,21,.07)', line: 'rgba(21,21,21,.16)',
    card: 'rgba(255,255,255,.55)', cardS: 'rgba(255,255,255,.8)', fig: INK, fig2: 'rgba(21,21,21,.35)', paper: '#fff', paperInk: INK },
};

// ---------- tekst ----------
const escH = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/[„“”"]/g, '');
const rich = (s) => escH(s).split('\n').map(l => l.replace(/\*(.+?)\*/g, '<span class="hl">$1</span>').replace(/_(.+?)_/g, '<em>$1</em>')).join('<br>');
const plainLen = s => String(s).replace(/[*_]/g, '').split('\n').reduce((m, l) => Math.max(m, l.length), 0);
const T = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-family="P" font-weight="${o.w || 600}" font-size="${o.size || 30}" fill="${o.fill}" text-anchor="${o.anchor || 'start'}"${o.ls ? ` letter-spacing="${o.ls}"` : ''}${o.op ? ` fill-opacity="${o.op}"` : ''}${o.it ? ' font-style="italic"' : ''}>${escH(s)}</text>`;

// ---------- postać z prostych kształtów ----------
function fig(j, c, o = {}) {
  const w = o.w || 34, s = a => a.map(p => p.join(',')).join(' ');
  const limb = pts => `<polyline points="${s(pts)}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const [sx, sy] = j.sh, [hx, hy] = j.hip;
  const torso = `<path d="M${sx - 40},${sy} L${sx + 40},${sy} L${hx + 28},${hy} L${hx - 28},${hy} Z" fill="${c}" stroke="${c}" stroke-width="22" stroke-linejoin="round"/>`;
  return `${limb(j.lL)}${limb(j.rL)}${torso}${limb(j.lA)}${limb(j.rA)}<circle cx="${j.head[0]}" cy="${j.head[1]}" r="${o.hr || 38}" fill="${c}"/>${o.extra || ''}`;
}
const P = {
  stand: { head: [200, 80], sh: [200, 150], hip: [200, 300], lA: [[160, 155], [148, 228], [150, 300]], rA: [[240, 155], [252, 228], [250, 300]], lL: [[185, 305], [180, 400], [176, 495]], rL: [[215, 305], [220, 400], [224, 495]] },
  win: { head: [200, 80], sh: [200, 150], hip: [200, 300], lA: [[160, 155], [118, 92], [96, 18]], rA: [[240, 155], [282, 92], [304, 18]], lL: [[185, 305], [176, 400], [160, 495]], rL: [[215, 305], [224, 400], [240, 495]] },
  think: { head: [200, 80], sh: [200, 150], hip: [200, 300], lA: [[160, 155], [150, 228], [196, 236]], rA: [[240, 155], [262, 210], [222, 126]], lL: [[185, 305], [180, 400], [176, 495]], rL: [[215, 305], [220, 400], [224, 495]] },
  slump: { head: [212, 112], sh: [200, 172], hip: [196, 310], lA: [[162, 176], [150, 250], [152, 318]], rA: [[238, 176], [250, 250], [248, 318]], lL: [[182, 312], [178, 405], [174, 495]], rL: [[212, 312], [218, 405], [222, 495]] },
  coach: { head: [200, 80], sh: [200, 150], hip: [200, 300], lA: [[160, 155], [140, 225], [196, 232]], rA: [[240, 155], [254, 228], [252, 300]], lL: [[185, 305], [180, 400], [176, 495]], rL: [[215, 305], [220, 400], [224, 495]] },
};
const person = (x, y, sc, pose, c, o = {}) => `<g transform="translate(${x},${y}) scale(${o.flip ? -sc : sc},${sc})${o.flip ? ` translate(-400,0)` : ''}">${fig(P[pose], c, o)}</g>`;
const check = (cx, cy, r, bg, fg) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${bg}"/><path d="M${cx - r * .42},${cy + r * .02} L${cx - r * .1},${cy + r * .34} L${cx + r * .46},${cy - r * .32}" fill="none" stroke="${fg}" stroke-width="${r * .26}" stroke-linecap="round" stroke-linejoin="round"/>`;
const cross = (cx, cy, r, bg, fg) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${bg}"/><path d="M${cx - r * .34},${cy - r * .34} L${cx + r * .34},${cy + r * .34} M${cx + r * .34},${cy - r * .34} L${cx - r * .34},${cy + r * .34}" stroke="${fg}" stroke-width="${r * .24}" stroke-linecap="round"/>`;
const chip = (x, y, s, bg, fg, size = 26) => { const w = s.length * size * .68 + 44; return `<rect x="${x}" y="${y}" width="${w}" height="${size + 26}" rx="${(size + 26) / 2}" fill="${bg}"/>${T(x + w / 2, y + size + 6, s, { size, w: 700, fill: fg, anchor: 'middle', ls: 1.5 })}`; };
const cloud = (cx, cy, s, fill) => `<g transform="translate(${cx},${cy}) scale(${s})"><circle cx="-40" cy="10" r="42" fill="${fill}"/><circle cx="10" cy="-18" r="54" fill="${fill}"/><circle cx="60" cy="12" r="40" fill="${fill}"/><rect x="-60" y="10" width="140" height="44" rx="22" fill="${fill}"/></g>`;

// ---------- ILUSTRACJE OKŁADEK (viewBox 900x620) ----------
const ART = {
  // zwycięzca na podium, a w dymku lista błędów
  podium: (t) => {
    const bars = [250, 190, 220, 160];
    return `<g>
    ${[[24, 16, 9], [600, 40, 7], [90, 120, 6], [520, 120, 8], [40, 300, 7]].map(([x, y, r], i) => `<rect x="${x}" y="${y}" width="${r * 2}" height="${r * 2}" rx="3" fill="${i % 2 ? t.fig : t.paper}" transform="rotate(${i * 23} ${x + r} ${y + r})" opacity=".85"/>`).join('')}
    <rect x="70" y="470" width="170" height="130" rx="10" fill="${t.fig}" opacity=".55"/>${T(155, 560, '2', { size: 64, w: 800, fill: t.onA, anchor: 'middle' })}
    <rect x="240" y="410" width="180" height="190" rx="10" fill="${t.fig}"/>${T(330, 520, '1', { size: 84, w: 800, fill: t.onA, anchor: 'middle' })}
    <rect x="420" y="500" width="170" height="100" rx="10" fill="${t.fig}" opacity=".35"/>${T(505, 572, '3', { size: 56, w: 800, fill: t.onA, anchor: 'middle' })}
    ${person(206, 100, 0.62, 'win', t.fig)}
    <circle cx="420" cy="132" r="11" fill="${t.paper}"/><circle cx="458" cy="104" r="17" fill="${t.paper}"/>
    <rect x="500" y="0" width="390" height="370" rx="34" fill="${t.paper}"/>
    ${T(540, 64, 'LISTA BŁĘDÓW', { size: 26, w: 800, fill: t.paperInk, ls: 3 })}
    ${bars.map((w, i) => `${cross(564, 128 + i * 64, 22, INK, '#fff')}<rect x="604" y="${118 + i * 64}" width="${w}" height="20" rx="10" fill="${INK}" opacity=".16"/>`).join('')}
    <line x1="0" y1="600" x2="900" y2="600" stroke="${t.fig}" stroke-width="6" stroke-linecap="round" opacity=".5"/></g>`;
  },
  // zawodnik się zastanawia, trener daleko: przerwana linia kontaktu
  coachGap: (t) => `<g>
    <rect x="0" y="576" width="900" height="6" rx="3" fill="${t.line}"/>
    ${person(40, 80, 1.0, 'think', t.fig)}
    ${cloud(390, 40, .95, t.A)}${T(405, 76, '?', { size: 100, w: 800, fill: t.onA, anchor: 'middle' })}
    <circle cx="298" cy="128" r="11" fill="${t.A}"/><circle cx="328" cy="100" r="16" fill="${t.A}"/>
    ${person(560, 80, 1.0, 'coach', t.fig2, { flip: true, extra: `<rect x="196" y="200" width="78" height="100" rx="10" fill="${t.fig2}" stroke="#2c2c30" stroke-width="6"/><rect x="214" y="190" width="42" height="20" rx="6" fill="#2c2c30"/>` })}
    <path d="M330 330 H600" stroke="${t.A}" stroke-width="8" stroke-dasharray="4 26" stroke-linecap="round"/>
    ${T(465, 300, 'domysły', { size: 30, w: 600, fill: t.mute, anchor: 'middle', it: 1 })}
  </g>`,
  // trening (spokojnie) | zawody (reflektor, oczy, ciężar)
  splitPressure: (t, v) => `<g>
    <rect x="0" y="0" width="436" height="620" rx="32" fill="${t.card}"/>
    <rect x="464" y="0" width="436" height="620" rx="32" fill="${t.cardS}"/>
    <path d="M682 0 L560 560 L804 560 Z" fill="${t.A}" opacity=".16"/>
    ${person(108, 140, .8, 'win', t.fig)}${check(360, 110, 38, t.A, t.onA)}
    ${person(586, 150, .8, 'slump', t.fig)}
    <rect x="610" y="96" width="140" height="62" rx="12" fill="${t.A}"/>${T(680, 140, v.weight || 'presja', { size: 30, w: 800, fill: t.onA, anchor: 'middle' })}
    <path d="M622 96 L640 70 H720 L738 96" fill="none" stroke="${t.A}" stroke-width="10" stroke-linejoin="round"/>
    ${[[510, 270], [520, 380], [852, 250], [846, 370]].map(([x, y]) => `<g transform="translate(${x},${y})"><ellipse rx="26" ry="16" fill="none" stroke="${t.fig}" stroke-width="6" opacity=".7"/><circle r="8" fill="${t.fig}" opacity=".7"/></g>`).join('')}
    <ellipse cx="218" cy="560" rx="120" ry="14" fill="${t.faint}"/><ellipse cx="682" cy="560" rx="120" ry="14" fill="${t.faint}"/>
  </g>`,
  // krzywa pobudzenie-wykonanie (jak 25.10)
  curve: (t) => `<g><path d="M60 20 V560 H860" fill="none" stroke="${t.soft}" stroke-width="6"/>
    <path d="M80 540 C260 540 300 120 460 120 C620 120 660 540 840 540" fill="none" stroke="${t.A}" stroke-width="14" stroke-linecap="round"/>
    <circle cx="460" cy="120" r="24" fill="${t.A}"/>${T(460, 70, 'twoja strefa', { size: 34, fill: t.fg, anchor: 'middle' })}</g>`,
};

// ---------- WIZUALIZACJE SLAJDÓW (viewBox 900x540) ----------
const VIZ = {
  // najpierw karta z tym, co wyszło; lista błędów schowana z tyłu
  checklist: (t, v) => `<g>
    <g transform="rotate(5 700 220)"><rect x="470" y="40" width="400" height="400" rx="28" fill="${t.faint}" stroke="${t.line}" stroke-width="3"/>
      ${chip(700, 66, 'POTEM', t.soft, t.fg, 24)}
      ${[0, 1, 2].map(i => `${cross(530, 168 + i * 80, 20, t.soft, t.fg)}<rect x="566" y="${158 + i * 80}" width="${220 - i * 40}" height="18" rx="9" fill="${t.soft}"/>`).join('')}</g>
    <g transform="rotate(-3 300 270)"><rect x="40" y="40" width="580" height="440" rx="32" fill="${t.paper}"/>
      ${T(90, 112, 'CO WYSZŁO', { size: 30, w: 800, fill: INK, ls: 3 })}${chip(390, 76, 'NAJPIERW', INK, Y, 24)}
      ${(v.items || ['', '', '']).map((s, i) => `${check(114, 200 + i * 100, 32, INK, Y)}${T(170, 213 + i * 100, s, { size: 38, w: 600, fill: INK })}`).join('')}</g></g>`,
  // stoper: 15 minut zaznaczone, a obok wykres wnioski vs zmęczenie
  timer: (t, v) => { const cx = 200, cy = 290, r = 170, a = Math.PI / 2;
    return `<g><rect x="${cx - 26}" y="${cy - r - 54}" width="52" height="36" rx="8" fill="${t.fg}"/><rect x="${cx - 12}" y="${cy - r - 22}" width="24" height="26" fill="${t.fg}"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${t.card}" stroke="${t.fg}" stroke-width="12"/>
    <path d="M${cx},${cy} L${cx},${cy - r + 22} A${r - 22},${r - 22} 0 0 1 ${cx + r - 22},${cy} Z" fill="${t.A}"/>
    ${[...Array(12)].map((_, i) => { const q = i * Math.PI / 6; return `<line x1="${cx + Math.sin(q) * (r - 6)}" y1="${cy - Math.cos(q) * (r - 6)}" x2="${cx + Math.sin(q) * (r - 28)}" y2="${cy - Math.cos(q) * (r - 28)}" stroke="${t.fg}" stroke-width="6" stroke-linecap="round" opacity=".5"/>`; }).join('')}
    <circle cx="${cx}" cy="${cy}" r="14" fill="${t.fg}"/>
    ${T(cx + 62, cy - 50, `${v.min || 15}`, { size: 54, w: 800, fill: t.onA, anchor: 'middle' })}${T(cx + 62, cy - 16, 'min', { size: 26, w: 700, fill: t.onA, anchor: 'middle' })}
    <g transform="translate(440,40)">
      <path d="M20 10 V440 H290" fill="none" stroke="${t.soft}" stroke-width="5"/>
      <line x1="120" y1="20" x2="120" y2="440" stroke="${t.fg}" stroke-width="4" stroke-dasharray="10 10" opacity=".6"/>
      ${T(132, 46, 'kropka', { size: 28, w: 700, fill: t.fg })}
      <path d="M30 420 C60 250 90 170 120 160 C180 150 230 152 280 150" fill="none" stroke="${t.A}" stroke-width="12" stroke-linecap="round"/>
      ${T(300, 160, 'wnioski', { size: 30, w: 800, fill: t.A })}
      <path d="M30 432 C120 425 170 400 210 350 C240 310 260 290 280 285" fill="none" stroke="${t.fg}" stroke-width="8" stroke-linecap="round" stroke-dasharray="2 16" opacity=".9"/>
      ${T(300, 296, 'zmęczenie', { size: 30, w: 700, fill: t.fg, op: .85 })}
      ${T(290, 486, 'czas →', { size: 26, w: 600, fill: t.mute, anchor: 'end' })}
    </g></g>`; },
  // tort bez wisienki
  cake: (t) => `<g transform="translate(150,0)">
    <ellipse cx="300" cy="500" rx="300" ry="30" fill="${t.faint}"/>
    <rect x="40" y="320" width="520" height="170" rx="26" fill="${t.fig}"/>
    <rect x="100" y="190" width="400" height="140" rx="24" fill="${t.paper}"/>
    <path d="M40 360 q43 40 87 0 t87 0 t87 0 t87 0 t87 0 t85 0" fill="none" stroke="${t.paper}" stroke-width="16" stroke-linecap="round"/>
    <path d="M100 230 q33 34 67 0 t67 0 t67 0 t67 0 t67 0 t65 0" fill="none" stroke="${t.A === INK ? Y : t.A}" stroke-width="14" stroke-linecap="round"/>
    <rect x="286" y="96" width="28" height="94" rx="8" fill="${t.A}"/><path d="M300 40 C330 70 320 92 300 92 C280 92 270 70 300 40 Z" fill="${t.A === INK ? '#f08a24' : Y}"/>
    <circle cx="420" cy="150" r="34" fill="none" stroke="${t.fg}" stroke-width="6" stroke-dasharray="10 10"/>
    <path d="M470 120 C520 80 560 70 600 70" fill="none" stroke="${t.fg}" stroke-width="5" stroke-linecap="round"/>
    ${T(612, 64, 'bez wisienki', { size: 30, w: 700, fill: t.fg, it: 1 })}${T(612, 104, 'i nadal tort', { size: 30, w: 700, fill: t.fg, it: 1 })}
  </g>`,
  // domysły (szare chmury) vs jedno pytanie (żółty dymek)
  guessVsAsk: (t, v) => { const g = v.guesses || ['skreślił mnie?', 'ma mnie dość?', 'nie pasuję mu?'];
    return `<g>${T(30, 40, 'ZGADUJESZ', { size: 28, w: 800, fill: t.mute, ls: 3 })}
    ${g.map((s, i) => `<g opacity="${1 - i * .22}"><rect x="${30 + i * 26}" y="${76 + i * 116}" width="400" height="88" rx="44" fill="none" stroke="${t.soft}" stroke-width="4" stroke-dasharray="12 10"/>${T(230 + i * 26, 132 + i * 116, s, { size: 34, w: 600, fill: t.mute, anchor: 'middle', it: 1 })}</g>`).join('')}
    <path d="M478 270 H560" stroke="${t.fg}" stroke-width="10" stroke-linecap="round"/><path d="M540 244 L572 270 L540 296" fill="none" stroke="${t.fg}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    ${T(610, 40, 'PYTASZ', { size: 28, w: 800, fill: t.A, ls: 3 })}
    <path d="M610 150 a30 30 0 0 1 30 -30 H850 a30 30 0 0 1 30 30 V330 a30 30 0 0 1 -30 30 H700 L650 410 V360 H640 a30 30 0 0 1 -30 -30 Z" fill="${t.A}"/>
    ${T(745, 220, (v.ask || ['Trenerze,', 'możemy', 'pogadać?'])[0], { size: 36, w: 800, fill: t.onA, anchor: 'middle' })}${T(745, 264, (v.ask || ['', 'możemy'])[1], { size: 36, w: 800, fill: t.onA, anchor: 'middle' })}${T(745, 308, (v.ask || ['', '', 'pogadać?'])[2], { size: 36, w: 800, fill: t.onA, anchor: 'middle' })}</g>`; },
  // poziom emocji: po meczu (za wysoko) vs przed treningiem (spokój)
  moment: (t, v) => { const col = (x, lab, lvl, ok) => `<g transform="translate(${x},0)">
      <rect x="0" y="0" width="410" height="520" rx="30" fill="${ok ? t.cardS : t.card}" ${ok ? `stroke="${t.A}" stroke-width="5"` : ''}/>
      ${T(205, 70, lab[0], { size: 30, w: 800, fill: ok ? t.A : t.mute, anchor: 'middle', ls: 2 })}${T(205, 110, lab[1], { size: 30, w: 800, fill: ok ? t.A : t.mute, anchor: 'middle', ls: 2 })}
      <rect x="150" y="150" width="110" height="270" rx="55" fill="none" stroke="${t.fg}" stroke-width="6" opacity=".6"/>
      <rect x="166" y="${166 + 238 * (1 - lvl)}" width="78" height="${238 * lvl}" rx="39" fill="${ok ? t.A : t.fg}" opacity="${ok ? 1 : .55}"/>
      ${T(300, 180, 'emocje', { size: 24, w: 600, fill: t.mute })}
      ${ok ? check(205, 470, 32, t.A, t.onA) : cross(205, 470, 32, t.soft, t.fg)}</g>`;
    return `<g>${col(20, v.bad || ['PO', 'MECZU'], .92, false)}${col(470, v.good || ['PRZED', 'TRENINGIEM'], .3, true)}</g>`; },
  // ogólnie (strzały wszędzie) vs konkret (w środek)
  targets: (t, v) => { const tg = (cx, ok) => `<circle cx="${cx}" cy="250" r="150" fill="none" stroke="${ok ? t.A : t.soft}" stroke-width="12"/><circle cx="${cx}" cy="250" r="96" fill="none" stroke="${ok ? t.A : t.soft}" stroke-width="12"/><circle cx="${cx}" cy="250" r="40" fill="${ok ? t.A : t.soft}"/>`;
    return `<g>${tg(220, false)}${[[110, 120], [340, 160], [140, 380], [330, 350], [60, 260], [260, 96]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="13" fill="${t.fg}" opacity=".7"/>`).join('')}
    ${tg(680, true)}<path d="M680 250 L860 70" stroke="${t.fg}" stroke-width="12" stroke-linecap="round"/><path d="M830 50 L880 50 L880 100 M852 70 L880 50" fill="none" stroke="${t.fg}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    ${T(220, 470, (v.left || 'ogólnie'), { size: 34, w: 700, fill: t.mute, anchor: 'middle', it: 1 })}${T(680, 470, (v.right || 'konkret'), { size: 34, w: 800, fill: t.A, anchor: 'middle' })}
    ${T(220, 516, v.leftSub || 'chcę więcej grać', { size: 30, w: 500, fill: t.mute, anchor: 'middle' })}${T(680, 516, v.rightSub || 'co mam poprawić?', { size: 30, w: 600, fill: t.fg, anchor: 'middle' })}</g>`; },
  // waga: trening lekko, zawody ciężko
  scale: (t, v) => { const W = v.weights || ['oczekiwania', 'wynik', 'ocena'];
    const a = 13 * Math.PI / 180, px = 450, py = 110, L = 330, lx = px - L * Math.cos(a), ly = py - L * Math.sin(a), rx = px + L * Math.cos(a), ry = py + L * Math.sin(a);
    const pan = (x, y, d) => `<path d="M${x} ${y} L${x - 110} ${y + d} M${x} ${y} L${x + 110} ${y + d}" stroke="${t.fg}" stroke-width="4" opacity=".5"/><path d="M${x - 120} ${y + d} H${x + 120} a120 40 0 0 1 -240 0 Z" fill="${t.fg}"/>`;
    return `<g><path d="M${px} ${py} V500 M${px - 110} 504 H${px + 110}" stroke="${t.fg}" stroke-width="14" stroke-linecap="round"/>
    <path d="M${lx} ${ly} L${rx} ${ry}" stroke="${t.fg}" stroke-width="12" stroke-linecap="round"/><circle cx="${px}" cy="${py}" r="20" fill="${t.A}"/>
    ${pan(lx, ly, 150)}${chip(lx - 52, ly + 92, 'błąd', t.soft, t.fg, 26)}
    ${T(lx, ly + 250, v.left || 'TRENING', { size: 32, w: 800, fill: t.mute, anchor: 'middle', ls: 3 })}
    ${pan(rx, ry, 300)}
    ${W.map((s, i) => { const w = s.length * 19 + 44; const y = ry + 300 - (i + 1) * 64; return `<rect x="${rx - w / 2}" y="${y}" width="${w}" height="58" rx="12" fill="${t.A}"/>${T(rx, y + 40, s, { size: 28, w: 800, fill: t.onA, anchor: 'middle' })}`; }).join('')}
    ${T(rx, ry + 400, v.right || 'ZAWODY', { size: 32, w: 800, fill: t.A, anchor: 'middle', ls: 3 })}</g>`; },
  // skala presji 1-10: trening -> trening ze stawką -> zawody
  meter: (t, v) => { const x0 = 60, x1 = 840, X = n => x0 + (x1 - x0) * (n - 1) / 9;
    return `<g>${T(x0, 40, 'PRESJA', { size: 26, w: 800, fill: t.mute, ls: 3 })}
    <defs><linearGradient id="mg" x1="0" x2="1"><stop offset="0" stop-color="${t.fg}" stop-opacity=".18"/><stop offset="1" stop-color="${t.A}"/></linearGradient></defs>
    <rect x="${x0}" y="150" width="${x1 - x0}" height="40" rx="20" fill="url(#mg)"/>
    ${[...Array(10)].map((_, i) => `${T(X(i + 1), 240, String(i + 1), { size: 28, w: 700, fill: t.mute, anchor: 'middle' })}`).join('')}
    ${[[v.from || 2, 'zwykły trening', t.soft, t.fg], [v.to || 6, 'trening ze stawką', t.A, t.onA], [v.top || 9, 'zawody', t.fg, t.fig === '#fff' ? INK : '#fff']].map(([n, s, bg, fg], i) => `<circle cx="${X(n)}" cy="170" r="${i === 1 ? 34 : 26}" fill="${bg}" stroke="${i === 1 ? t.fg : 'none'}" stroke-width="6"/>${T(X(n), i === 1 ? 100 : 108, s, { size: i === 1 ? 30 : 26, w: i === 1 ? 800 : 600, fill: i === 1 ? t.A : t.mute, anchor: 'middle' })}`).join('')}
    <path d="M${X(v.from || 2)} 284 H${X(v.to || 6) - 14}" stroke="${t.A}" stroke-width="8" stroke-linecap="round"/><path d="M${X(v.to || 6) - 30} 266 L${X(v.to || 6) - 6} 284 L${X(v.to || 6) - 30} 302" fill="none" stroke="${t.A}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
    ${T(X(v.to || 6) + 24, 296, 'dodaj stawkę', { size: 30, w: 700, fill: t.A })}
    ${(() => { const cs = v.chips || ['liczony wynik', 'zadanie z karą', 'ktoś patrzy']; const ws = cs.map(c => c.length * 16.5 + 76); let x = (900 - ws.reduce((a, b) => a + b, 0) - 20 * (cs.length - 1)) / 2;
      return cs.map((c, i) => { const o = `<rect x="${x}" y="380" width="${ws[i]}" height="110" rx="55" fill="${t.card}" stroke="${t.line}" stroke-width="3"/><circle cx="${x + 36}" cy="435" r="11" fill="${t.A}"/>${T(x + 58, 445, c, { size: 29, w: 700, fill: t.fg })}`; x += ws[i] + 20; return o; }).join(''); })()}</g>`; },
  // to samo tu i tu
  same: (t, v) => { const it = v.items || ['rozgrzewka', 'słowa w głowie', 'reset po błędzie'];
    return `<g>${T(210, 40, v.left || 'TRENING', { size: 30, w: 800, fill: t.mute, anchor: 'middle', ls: 3 })}${T(690, 40, v.right || 'ZAWODY', { size: 30, w: 800, fill: t.A, anchor: 'middle', ls: 3 })}
    ${it.map((s, i) => { const y = 80 + i * 150; return `<rect x="10" y="${y}" width="400" height="120" rx="26" fill="${t.card}" stroke="${t.line}" stroke-width="3"/>${T(210, y + 72, s, { size: 34, w: 700, fill: t.fg, anchor: 'middle' })}
      <rect x="490" y="${y}" width="400" height="120" rx="26" fill="${t.A}"/>${T(690, y + 72, s, { size: 34, w: 800, fill: t.onA, anchor: 'middle' })}
      ${T(450, y + 82, '=', { size: 64, w: 800, fill: t.fg, anchor: 'middle' })}`; }).join('')}</g>`; },
};

// małe ilustracje na ostatni slajd (viewBox 400x300)
const END = {
  think: t => `${person(10, 20, .54, 'think', t.fig)}${cloud(300, 90, .95, t.A)}${T(315, 124, '?', { size: 96, w: 800, fill: t.onA, anchor: 'middle' })}<circle cx="190" cy="80" r="11" fill="${t.A}"/><circle cx="222" cy="62" r="16" fill="${t.A}"/>`,
  bubble: t => `<path d="M60 40 a30 30 0 0 1 30 -30 H330 a30 30 0 0 1 30 30 V190 a30 30 0 0 1 -30 30 H170 L110 280 V220 H90 a30 30 0 0 1 -30 -30 Z" fill="${t.A}"/>${T(210, 165, '?', { size: 150, w: 800, fill: t.onA, anchor: 'middle' })}`,
};

// ---------- składanie slajdów ----------
const PAD = 96;
const foot = (t, i, swipe) => `<div class="ft" style="color:${t.mute}">@psychologsportowy · ${i}/5</div>${swipe ? `<div class="sw" style="color:${t.A}">przesuń <span>→</span></div>` : ''}`;
const titleSize = (s, base) => { const n = plainLen(s); return n <= 14 ? base : n <= 18 ? base - 8 : n <= 22 ? base - 16 : base - 24; };
const kick = (t, s) => s ? `<div class="kick" style="color:${t.A === INK ? INK : Y}"><span style="background:${t.A};color:${t.onA}">${escH(s)}</span></div>` : '';

function cover(t, c) {
  const art = ART[c.art.type](t, c.art);
  const ts = c.size || titleSize(c.title, 104);
  const pre = c.pre ? `<div class="pre" style="color:${t.mute}">${rich(c.pre)}</div>` : '';
  const title = pre + `<div class="h" style="font-size:${ts}px;color:${t.fg}${c.italic ? ';font-style:italic' : ''}">${rich(c.title)}</div>`;
  const sub = c.sub ? `<div class="sub" style="color:${t.mute}">${rich(c.sub)}</div>` : '';
  if (c.layout === 'top') return `<div class="box" style="top:110px">${kick(t, c.kicker)}${title}${sub}</div>
    <svg class="art" viewBox="0 0 900 620" style="top:${c.artTop || 590}px;height:${c.artH || 560}px">${art}</svg>`;
  if (c.layout === 'split') return `<div class="lab" style="left:${PAD}px;width:436px;color:${t.mute}">${escH(c.left || 'PRZED')}</div><div class="lab" style="left:${PAD + 464}px;width:436px;color:${t.A}">${escH(c.right || 'PO')}</div>
    <svg class="art" viewBox="0 0 900 620" style="top:170px;height:${c.artH || 580}px">${art}</svg>
    <div class="box" style="top:${c.titleTop || 840}px">${title}${sub}</div>`;
  if (c.layout === 'big') return `<div class="box" style="top:120px"><div style="font:800 420px/0.9 P;color:${t.A};letter-spacing:-12px">${escH(c.big)}</div>${title}${sub}</div>
    <svg class="art" viewBox="0 0 900 620" style="top:780px;height:380px;left:auto;right:${PAD}px;width:550px">${art}</svg>`;
  // hero
  return `<svg class="art" viewBox="0 0 900 620" style="top:${c.artTop || 110}px;height:${c.artH || 600}px">${art}</svg>
    <div class="box" style="top:${c.titleTop || 770}px">${kick(t, c.kicker)}${title}${sub}</div>`;
}
function point(t, p, n) {
  return `<svg class="art" viewBox="0 0 900 540" style="top:130px;height:540px">${VIZ[p.viz.type](t, p.viz)}</svg>
    <div class="box" style="top:${p.top || 730}px">
      <div class="row"><div class="num" style="color:${t.A === INK ? INK : Y}">${n}</div><div class="h" style="font-size:${p.size || 70}px;color:${t.fg}">${rich(p.title)}</div></div>
      <div class="body" style="color:${t.fg}">${rich(p.body)}</div></div>`;
}
function end(t, e) {
  return `<div class="box" style="top:150px;align-items:center;text-align:center">
    <svg viewBox="0 0 400 300" style="width:400px;height:300px;margin-bottom:60px">${END[e.art || 'think'](t)}</svg>
    <div class="h" style="font-size:${e.size || 80}px;color:${t.fg}">${rich(e.question)}</div>
    <div style="width:150px;height:10px;border-radius:5px;background:${t.A};margin:60px 0 50px"></div>
    <div class="cta" style="color:${t.fg}"><svg viewBox="0 0 24 24" width="44" height="44" style="flex:none"><path d="M6 3h12v18l-6-4.5L6 21z" fill="${t.A}"/></svg><span>${rich(e.cta || 'Zapisz, żeby wrócić przed startem.')}</span></div></div>`;
}
function doc(t, inner) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${FONT}
  html,body{margin:0;width:1080px;height:1350px;overflow:hidden;position:relative;font-family:P}
  body{background:${t.bg}}
  .art{position:absolute;left:${PAD + 0}px;width:${1080 - 2 * PAD}px;overflow:visible}
  .box{position:absolute;left:${PAD}px;right:${PAD}px;display:flex;flex-direction:column;align-items:flex-start}
  .h{font-weight:800;line-height:1.12;letter-spacing:-1.5px}
  .h em{font-weight:800;font-style:italic}
  .hl{${t.A === INK ? `background:${INK};color:${Y};padding:0 .16em;border-radius:.12em;-webkit-box-decoration-break:clone;box-decoration-break:clone` : `color:${Y}`}}
  .kick{margin-bottom:34px}.kick span{font:800 28px P;letter-spacing:4px;padding:12px 24px;border-radius:10px;display:inline-block}
  .sub{font:600 40px/1.35 P;margin-top:30px}.pre{font:700 54px/1.2 P;margin-bottom:18px;text-decoration:line-through;text-decoration-thickness:5px}
  .row{display:flex;align-items:center;gap:34px;margin-bottom:30px}
  .num{font:800 150px/0.85 P;letter-spacing:-6px;flex:none}
  .body{font:500 40px/1.45 P}
  .cta{display:flex;align-items:center;gap:20px;font:600 40px/1.35 P;text-align:left}
  .lab{position:absolute;top:100px;text-align:center;font:800 34px P;letter-spacing:5px}
  .ft{position:absolute;left:${PAD}px;bottom:70px;font:600 28px P;letter-spacing:.5px}
  .sw{position:absolute;right:${PAD}px;bottom:62px;font:700 34px P}.sw span{font-size:40px}
  </style></head><body>${inner}</body></html>`;
}

async function main() {
  const [, , specPath, outDir] = process.argv;
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  const t = TH[spec.theme || 'grafit'];
  fs.mkdirSync(outDir, { recursive: true });
  const pages = [
    cover(t, spec.cover) + foot(t, 1, true),
    ...spec.points.map((p, i) => point(t, p, i + 1) + foot(t, i + 2)),
    end(t, spec.end) + foot(t, 5),
  ];
  const { chromium } = require('playwright');
  const g = fs.readdirSync('/opt/pw-browsers').filter(d => d.startsWith('chromium_headless_shell')).sort().reverse();
  const b = await chromium.launch({ executablePath: `/opt/pw-browsers/${g[0]}/chrome-linux/headless_shell`, args: ['--no-sandbox'] });
  const pg = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  const tmp = path.join(__dirname, `.tmp2-${process.pid}.html`);
  for (const [i, inner] of pages.entries()) {
    fs.writeFileSync(tmp, doc(t, inner));
    await pg.goto('file://' + tmp);
    await pg.evaluate(() => document.fonts.ready);
    await pg.screenshot({ path: path.join(outDir, `${i + 1}.png`) });
  }
  fs.unlinkSync(tmp);
  await b.close();
}
if (require.main === module) main();
module.exports = { ART, VIZ, TH };
