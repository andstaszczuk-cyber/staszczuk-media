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
//     "big": "3", "bigSize": 300, "bigSub": "minut do startu", "vb": "0 0 900 420"             // tylko big (duża liczba/hasło + mały rysunek w prawym dolnym rogu)
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
    <g transform="rotate(5 700 220)" ${v.back === false ? 'display="none"' : ''}><rect x="470" y="40" width="400" height="400" rx="28" fill="${t.faint}" stroke="${t.line}" stroke-width="3"/>
      ${chip(700, 66, v.backChip || 'POTEM', t.soft, t.fg, 24)}
      ${[0, 1, 2].map(i => `${cross(530, 168 + i * 80, 20, t.soft, t.fg)}<rect x="566" y="${158 + i * 80}" width="${220 - i * 40}" height="18" rx="9" fill="${t.soft}"/>`).join('')}</g>
    <g transform="rotate(-3 300 270)"><rect x="40" y="40" width="580" height="440" rx="32" fill="${t.paper}"/>
      ${T(90, 112, v.title || 'CO WYSZŁO', { size: 30, w: 800, fill: INK, ls: 3 })}${chip(v.chipX || 390, 76, v.chip || 'NAJPIERW', INK, Y, 24)}
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

// ---------- ROZSZERZENIE: pozy, ikony, scena, wizualizacje sterowane etykietami ----------
Object.assign(P, {
  run: { head: [226, 82], sh: [212, 152], hip: [192, 300], lA: [[176, 160], [128, 214], [150, 270]], rA: [[248, 160], [296, 200], [336, 166]], lL: [[178, 305], [118, 372], [58, 430]], rL: [[206, 305], [262, 392], [244, 495]] },
  walk: { head: [204, 80], sh: [200, 150], hip: [198, 300], lA: [[162, 156], [140, 228], [134, 292]], rA: [[238, 156], [262, 226], [280, 284]], lL: [[184, 305], [156, 400], [130, 495]], rL: [[212, 305], [236, 400], [268, 495]] },
  sit: { head: [200, 70], sh: [200, 145], hip: [200, 340], lA: [[160, 155], [140, 250], [175, 320]], rA: [[240, 155], [260, 250], [225, 320]], lL: [[180, 345], [90, 355], [90, 500]], rL: [[220, 345], [310, 355], [310, 500]] },
  point: { head: [200, 80], sh: [200, 150], hip: [200, 300], lA: [[160, 155], [148, 228], [150, 300]], rA: [[240, 155], [310, 150], [380, 130]], lL: [[185, 305], [180, 400], [176, 495]], rL: [[215, 305], [220, 400], [224, 495]] },
  hips: { head: [200, 80], sh: [200, 150], hip: [200, 300], lA: [[160, 155], [112, 214], [158, 262]], rA: [[240, 155], [288, 214], [242, 262]], lL: [[185, 305], [168, 400], [150, 495]], rL: [[215, 305], [232, 400], [250, 495]] },
  wave: { head: [200, 80], sh: [200, 150], hip: [200, 300], lA: [[160, 155], [148, 228], [150, 300]], rA: [[240, 155], [290, 110], [300, 30]], lL: [[185, 305], [180, 400], [176, 495]], rL: [[215, 305], [220, 400], [224, 495]] },
  crouch: { head: [210, 150], sh: [200, 215], hip: [190, 350], lA: [[164, 220], [190, 300], [240, 330]], rA: [[236, 220], [262, 290], [290, 330]], lL: [[176, 355], [250, 420], [190, 495]], rL: [[206, 355], [290, 400], [270, 495]] },
});
const C = (t, c) => ({ fig: t.fig, fig2: t.fig2, A: t.A, onA: t.onA, paper: t.paper, soft: t.soft, mute: t.mute, fg: t.fg, card: t.card, cardS: t.cardS, faint: t.faint, line: t.line, ink: INK, Y: Y })[c] || c || t.fig;
// ikony 100x100, wypełnione plamy + kreski
const ICO = {
  foot: c => `<ellipse cx="38" cy="58" rx="14" ry="24" fill="${c}"/><ellipse cx="66" cy="38" rx="13" ry="22" fill="${c}"/><circle cx="38" cy="90" r="8" fill="${c}"/><circle cx="66" cy="68" r="7" fill="${c}"/>`,
  hand: c => `<rect x="28" y="44" width="46" height="44" rx="16" fill="${c}"/>${[30, 42, 54, 66].map((x, i) => `<rect x="${x - 4}" y="${12 + (i % 3) * 4}" width="11" height="40" rx="5.5" fill="${c}"/>`).join('')}<rect x="10" y="50" width="30" height="11" rx="5.5" transform="rotate(-35 25 55)" fill="${c}"/>`,
  wind: c => `<path d="M10 36 H62 a12 12 0 1 0 -12 -12 M10 56 H78 a12 12 0 1 1 -12 12 M10 76 H46" fill="none" stroke="${c}" stroke-width="8" stroke-linecap="round"/>`,
  eye: c => `<path d="M6 50 Q50 10 94 50 Q50 90 6 50 Z" fill="none" stroke="${c}" stroke-width="7"/><circle cx="50" cy="50" r="14" fill="${c}"/>`,
  ruler: c => `<rect x="8" y="34" width="84" height="32" rx="5" fill="none" stroke="${c}" stroke-width="7"/>${[22, 36, 50, 64, 78].map((x, i) => `<line x1="${x}" y1="34" x2="${x}" y2="${i % 2 ? 46 : 52}" stroke="${c}" stroke-width="5"/>`).join('')}`,
  heart: c => `<path d="M50 88 C18 64 8 48 10 32 C12 18 24 10 36 12 C43 13 47 18 50 24 C53 18 57 13 64 12 C76 10 88 18 90 32 C92 48 82 64 50 88 Z" fill="${c}"/>`,
  moon: c => `<path d="M64 10 A40 40 0 1 0 90 66 A32 32 0 1 1 64 10 Z" fill="${c}"/>`,
  clock: c => `<circle cx="50" cy="50" r="40" fill="none" stroke="${c}" stroke-width="8"/><path d="M50 26 V50 L66 60" fill="none" stroke="${c}" stroke-width="8" stroke-linecap="round"/>`,
  flag: c => `<path d="M24 92 V10" stroke="${c}" stroke-width="8" stroke-linecap="round"/><path d="M26 12 H80 L68 30 L80 48 H26 Z" fill="${c}"/>`,
  ball: c => `<circle cx="50" cy="50" r="40" fill="none" stroke="${c}" stroke-width="7"/><path d="M50 32 L66 44 L60 63 H40 L34 44 Z" fill="${c}"/><path d="M50 32 V12 M66 44 L86 38 M60 63 L72 82 M40 63 L28 82 M34 44 L14 38" stroke="${c}" stroke-width="5"/>`,
  bolt: c => `<path d="M58 6 L22 56 H46 L38 94 L78 40 H54 Z" fill="${c}"/>`,
  star: c => `<path d="M50 6 L62 38 L96 38 L68 58 L78 92 L50 72 L22 92 L32 58 L4 38 L38 38 Z" fill="${c}"/>`,
  book: c => `<path d="M50 24 C38 14 20 14 8 18 V82 C20 78 38 78 50 88 C62 78 80 78 92 82 V18 C80 14 62 14 50 24 Z M50 24 V88" fill="none" stroke="${c}" stroke-width="7" stroke-linejoin="round"/>`,
  check: c => `<circle cx="50" cy="50" r="40" fill="none" stroke="${c}" stroke-width="8"/><path d="M30 52 L44 66 L72 36" fill="none" stroke="${c}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`,
  battery: c => `<rect x="8" y="28" width="76" height="44" rx="8" fill="none" stroke="${c}" stroke-width="7"/><rect x="86" y="40" width="8" height="20" rx="3" fill="${c}"/><rect x="18" y="38" width="20" height="24" rx="3" fill="${c}"/>`,
  sun: c => `<circle cx="50" cy="50" r="20" fill="${c}"/>${[...Array(8)].map((_, i) => { const a = i * Math.PI / 4; return `<line x1="${50 + Math.cos(a) * 30}" y1="${50 + Math.sin(a) * 30}" x2="${50 + Math.cos(a) * 44}" y2="${50 + Math.sin(a) * 44}" stroke="${c}" stroke-width="7" stroke-linecap="round"/>`; }).join('')}`,
  snow: c => `${[0, 60, 120].map(a => `<g transform="rotate(${a} 50 50)"><line x1="50" y1="8" x2="50" y2="92" stroke="${c}" stroke-width="7" stroke-linecap="round"/><path d="M38 18 L50 30 L62 18 M38 82 L50 70 L62 82" fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round"/></g>`).join('')}`,
  shield: c => `<path d="M50 8 L86 22 V48 C86 70 70 86 50 94 C30 86 14 70 14 48 V22 Z" fill="${c}"/>`,
  pause: c => `<rect x="24" y="16" width="18" height="68" rx="6" fill="${c}"/><rect x="58" y="16" width="18" height="68" rx="6" fill="${c}"/>`,
  play: c => `<path d="M30 14 L84 50 L30 86 Z" fill="${c}"/>`,
  mountain: c => `<path d="M4 88 L38 30 L56 58 L70 40 L96 88 Z" fill="${c}"/><path d="M70 40 V12 L86 18 L70 24" fill="none" stroke="${c}" stroke-width="5"/>`,
  note: c => `<rect x="18" y="8" width="64" height="84" rx="8" fill="none" stroke="${c}" stroke-width="7"/><path d="M32 32 H68 M32 50 H68 M32 68 H54" stroke="${c}" stroke-width="7" stroke-linecap="round"/>`,
  mic: c => `<rect x="36" y="8" width="28" height="52" rx="14" fill="${c}"/><path d="M22 46 a28 28 0 0 0 56 0 M50 74 V92 M34 92 H66" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round"/>`,
  whistle: c => `<circle cx="40" cy="60" r="28" fill="${c}"/><rect x="40" y="32" width="52" height="22" rx="6" fill="${c}"/><circle cx="40" cy="60" r="9" fill="#fff" opacity=".6"/>`,
  bench: c => `<rect x="6" y="40" width="88" height="14" rx="6" fill="${c}"/><rect x="14" y="54" width="10" height="34" fill="${c}"/><rect x="76" y="54" width="10" height="34" fill="${c}"/><rect x="6" y="18" width="88" height="10" rx="5" fill="${c}" opacity=".6"/>`,
  cloudRain: c => `<path d="M26 60 a18 18 0 0 1 2 -36 a26 26 0 0 1 48 6 a16 16 0 0 1 2 30 Z" fill="${c}"/><path d="M34 72 L28 90 M54 72 L48 90 M74 72 L68 90" stroke="${c}" stroke-width="7" stroke-linecap="round"/>`,
  people: c => `<circle cx="30" cy="34" r="12" fill="${c}"/><circle cx="70" cy="34" r="12" fill="${c}"/><circle cx="50" cy="28" r="14" fill="${c}"/><path d="M14 84 C14 60 26 52 30 52 M86 84 C86 60 74 52 70 52 M28 88 C28 58 40 48 50 48 C60 48 72 58 72 88 Z" fill="${c}" stroke="${c}" stroke-width="4"/>`,
  phone: c => `<rect x="28" y="6" width="44" height="88" rx="10" fill="none" stroke="${c}" stroke-width="7"/><circle cx="50" cy="80" r="5" fill="${c}"/>`,
  trophy: c => `<path d="M30 10 H70 V40 a20 20 0 0 1 -40 0 Z" fill="${c}"/><path d="M30 18 H14 a16 16 0 0 0 18 26 M70 18 H86 a16 16 0 0 1 -18 26" fill="none" stroke="${c}" stroke-width="6"/><rect x="44" y="58" width="12" height="18" fill="${c}"/><rect x="30" y="76" width="40" height="12" rx="4" fill="${c}"/>`,
  brain: c => `<path d="M50 14 C40 6 22 10 22 26 C10 30 8 48 18 54 C12 66 22 80 36 78 C40 88 56 88 60 78 C76 82 88 68 82 56 C92 48 88 30 76 28 C76 12 58 6 50 14 Z" fill="${c}"/><path d="M50 16 V82" stroke="#fff" stroke-opacity=".45" stroke-width="5"/>`,
  dumbbell: c => `<rect x="30" y="44" width="40" height="12" fill="${c}"/><rect x="14" y="26" width="16" height="48" rx="5" fill="${c}"/><rect x="70" y="26" width="16" height="48" rx="5" fill="${c}"/><rect x="4" y="36" width="10" height="28" rx="4" fill="${c}"/><rect x="86" y="36" width="10" height="28" rx="4" fill="${c}"/>`,
  bed: c => `<rect x="6" y="50" width="88" height="22" rx="6" fill="${c}"/><rect x="6" y="30" width="12" height="56" rx="4" fill="${c}"/><rect x="20" y="38" width="26" height="14" rx="6" fill="${c}" opacity=".6"/>`,
};
const icon = (name, x, y, s, c) => `<g transform="translate(${x},${y}) scale(${s / 100})">${(ICO[name] || ICO.star)(c)}</g>`;
const wrapTxt = (s, n) => { const w = String(s).split(' '); const out = []; let cur = ''; for (const x of w) { if ((cur + ' ' + x).trim().length > n && cur) { out.push(cur); cur = x; } else cur = (cur + ' ' + x).trim(); } if (cur) out.push(cur); return out; };
const lines = (x, y, arr, o) => arr.map((s, i) => T(x, y + i * (o.lh || o.size * 1.25), s, o)).join('');
const arrowD = (x1, y1, x2, y2, c, w = 8) => { const a = Math.atan2(y2 - y1, x2 - x1), h = 26; return `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/><path d="M${x2 - h * Math.cos(a - .5)} ${y2 - h * Math.sin(a - .5)} L${x2} ${y2} L${x2 - h * Math.cos(a + .5)} ${y2 - h * Math.sin(a + .5)}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`; };
const card = (x, y, w, h, t, hl) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="26" fill="${hl ? t.A : t.card}" ${hl ? '' : `stroke="${t.line}" stroke-width="3"`}/>`;
// SCENA: swobodna kompozycja z elementów (okładki i slajdy)
const EL = {
  person: (t, e) => person(e.x, e.y, e.s || 1, e.pose || 'stand', C(t, e.c || 'fig'), { flip: e.flip, extra: e.extra }),
  icon: (t, e) => icon(e.name, e.x, e.y, e.s || 100, C(t, e.c || 'A')),
  cloud: (t, e) => `${cloud(e.x, e.y, e.s || 1, C(t, e.c || 'A'))}${e.text ? T(e.x + 10 * (e.s || 1), e.y + 34 * (e.s || 1), e.text, { size: e.size || 90, w: 800, fill: C(t, e.tc || 'onA'), anchor: 'middle' }) : ''}${(e.dots || []).map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${C(t, e.c || 'A')}"/>`).join('')}`,
  bubble: (t, e) => { const { x, y, w, h } = e, f = C(t, e.c || 'A'), tc = C(t, e.tc || (e.c === 'paper' ? 'ink' : e.c === 'card' || e.c === 'soft' ? 'fg' : 'onA')); const tail = e.tail === 'right' ? `M${x + w - 70} ${y + h - 2} L${x + w - 20} ${y + h + 50} L${x + w - 120} ${y + h - 2} Z` : e.tail === 'none' ? '' : `M${x + 70} ${y + h - 2} L${x + 20} ${y + h + 50} L${x + 120} ${y + h - 2} Z`;
    const ls = e.lines || []; const sz = e.size || 34; const y0 = y + h / 2 - (ls.length - 1) * sz * .62 + sz * .36;
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${e.r || 34}" fill="${f}" ${e.dash ? `fill-opacity="0" stroke="${C(t, 'soft')}" stroke-width="4" stroke-dasharray="12 10"` : ''}/>${tail ? `<path d="${tail}" fill="${f}" ${e.dash ? 'fill-opacity="0"' : ''}/>` : ''}${ls.map((s, i) => T(x + w / 2, y0 + i * sz * 1.24, s, { size: sz, w: e.fw || 800, fill: tc, anchor: 'middle', it: e.it })).join('')}`; },
  chip: (t, e) => chip(e.x, e.y, e.text, C(t, e.c || 'A'), C(t, e.tc || 'onA'), e.size || 26),
  text: (t, e) => lines(e.x, e.y, [].concat(e.t), { size: e.size || 32, w: e.w || 700, fill: C(t, e.c || 'fg'), anchor: e.anchor || 'start', it: e.it, ls: e.ls, lh: e.lh }),
  rect: (t, e) => `<rect x="${e.x}" y="${e.y}" width="${e.w}" height="${e.h}" rx="${e.r ?? 20}" fill="${C(t, e.c || 'card')}" ${e.stroke ? `stroke="${C(t, e.stroke)}" stroke-width="${e.sw || 4}"` : ''} ${e.op ? `opacity="${e.op}"` : ''} ${e.rot ? `transform="rotate(${e.rot} ${e.x + e.w / 2} ${e.y + e.h / 2})"` : ''}/>`,
  circle: (t, e) => `<circle cx="${e.x}" cy="${e.y}" r="${e.r}" fill="${e.fill === 'none' ? 'none' : C(t, e.c || 'A')}" ${e.stroke ? `stroke="${C(t, e.stroke)}" stroke-width="${e.sw || 6}"` : ''} ${e.op ? `opacity="${e.op}"` : ''} ${e.dash ? 'stroke-dasharray="10 10"' : ''}/>`,
  line: (t, e) => `<path d="M${e.x1} ${e.y1} L${e.x2} ${e.y2}" stroke="${C(t, e.c || 'line')}" stroke-width="${e.w || 6}" stroke-linecap="round" ${e.dash ? `stroke-dasharray="${e.dash}"` : ''}/>`,
  path: (t, e) => `<path d="${e.d}" fill="${e.fill ? C(t, e.fill) : 'none'}" stroke="${e.c ? C(t, e.c) : 'none'}" stroke-width="${e.w || 8}" stroke-linecap="round" stroke-linejoin="round" ${e.dash ? `stroke-dasharray="${e.dash}"` : ''} ${e.op ? `opacity="${e.op}"` : ''}/>`,
  arrow: (t, e) => arrowD(e.x1, e.y1, e.x2, e.y2, C(t, e.c || 'A'), e.w || 8),
  check: (t, e) => check(e.x, e.y, e.r || 30, C(t, e.c || 'A'), C(t, e.tc || 'onA')),
  cross: (t, e) => cross(e.x, e.y, e.r || 30, C(t, e.c || 'soft'), C(t, e.tc || 'fg')),
  floor: (t, e) => `<rect x="${e.x || 0}" y="${e.y}" width="${e.w || 900}" height="6" rx="3" fill="${t.line}"/>`,
  spot: (t, e) => `<path d="M${e.x} ${e.y} L${e.x - e.w / 2} ${e.y2} L${e.x + e.w / 2} ${e.y2} Z" fill="${t.A}" opacity=".16"/>`,
  eyes: (t, e) => e.pts.map(([x, y]) => `<g transform="translate(${x},${y})"><ellipse rx="26" ry="16" fill="none" stroke="${t.fig}" stroke-width="6" opacity=".75"/><circle r="8" fill="${t.fig}" opacity=".75"/></g>`).join(''),
  bed: (t, e) => `<g transform="translate(${e.x},${e.y})"><rect x="0" y="120" width="${e.w || 520}" height="60" rx="16" fill="${C(t, e.c || 'fig2')}"/><rect x="0" y="40" width="30" height="200" rx="10" fill="${C(t, e.c || 'fig2')}"/><rect x="${(e.w || 520) - 30}" y="90" width="30" height="150" rx="10" fill="${C(t, e.c || 'fig2')}"/>
    <circle cx="90" cy="88" r="40" fill="${t.fig}"/><path d="M130 120 Q${(e.w || 520) / 2} 50 ${(e.w || 520) - 40} 120 Z" fill="${C(t, e.blanket || 'A')}"/><rect x="40" y="98" width="100" height="26" rx="12" fill="${t.paper}" opacity=".7"/></g>`,
  stairs: (t, e) => { const n = e.n || 4, sw = e.sw || 150, sh = e.sh || 90; let d = `M${e.x} ${e.y}`; for (let i = 0; i < n; i++) d += ` h${sw} v${-sh}`; d += ` h${sw}`;
    return `<path d="${d} V${e.y + 20} H${e.x} Z" fill="${C(t, e.c || 'card')}"/><path d="${d}" fill="none" stroke="${C(t, e.stroke || 'A')}" stroke-width="10" stroke-linejoin="round"/>${(e.labels || []).map((s, i) => T(e.x + i * sw + sw / 2, e.y - i * sh + 50, s, { size: e.size || 26, w: 700, fill: t.fg, anchor: 'middle' })).join('')}`; },
  backpack: (t, e) => `<g transform="translate(${e.x},${e.y})"><rect x="0" y="30" width="${e.w || 200}" height="${e.h || 240}" rx="40" fill="${C(t, e.c || 'fig2')}"/><path d="M50 30 a50 40 0 0 1 100 0" fill="none" stroke="${C(t, e.c || 'fig2')}" stroke-width="16"/>${(e.labels || []).map((s, i) => `<rect x="20" y="${60 + i * 62}" width="${(e.w || 200) - 40}" height="50" rx="12" fill="${t.A}"/>${T((e.w || 200) / 2, 95 + i * 62, s, { size: 26, w: 800, fill: t.onA, anchor: 'middle' })}`).join('')}</g>`,
  gauge: (t, e) => { const { x, y, r } = e, v = e.v ?? .5, a = Math.PI * (1 - v); return `<path d="M${x - r} ${y} A${r} ${r} 0 0 1 ${x + r} ${y}" fill="none" stroke="${t.soft}" stroke-width="${r * .22}"/>
    <path d="M${x - r} ${y} A${r} ${r} 0 0 1 ${x + r * Math.cos(Math.PI * (1 - (e.hi || 1)))} ${y - r * Math.sin(Math.PI * (1 - (e.hi || 1)))}" fill="none" stroke="${t.A}" stroke-width="${r * .22}" ${e.lo ? `stroke-dasharray="0 ${Math.PI * r * e.lo} ${Math.PI * r}"` : ''}/>
    <path d="M${x} ${y} L${x + Math.cos(a) * r * .8} ${y - Math.sin(a) * r * .8}" stroke="${t.fg}" stroke-width="${r * .08}" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="${r * .1}" fill="${t.fg}"/>${(e.labels || []).map(([s, vv]) => { const aa = Math.PI * (1 - vv); return T(x + Math.cos(aa) * r * 1.32, y - Math.sin(aa) * r * 1.32 + 10, s, { size: 28, w: 700, fill: t.mute, anchor: 'middle' }); }).join('')}`; },
  iceberg: (t, e) => `<rect x="0" y="${e.y}" width="900" height="${560 - e.y}" fill="${t.faint}"/><line x1="0" y1="${e.y}" x2="900" y2="${e.y}" stroke="${t.A}" stroke-width="5" stroke-dasharray="14 10"/>
    <path d="M370 ${e.y} L430 ${e.y - 110} L470 ${e.y - 150} L520 ${e.y - 100} L560 ${e.y} Z" fill="${t.paper}"/><path d="M370 ${e.y} L560 ${e.y} L700 ${e.y + 90} L660 ${e.y + 200} L500 ${e.y + 250} L300 ${e.y + 220} L220 ${e.y + 110} Z" fill="${t.paper}" opacity=".35"/>`,
  viz: (t, e) => `<g transform="translate(${e.x || 0},${e.y || 0}) scale(${e.s || 1})">${VIZ[e.type](t, e)}</g>`,
};
const scene = (t, v) => (v.items || []).map(e => (EL[e.k] || (() => ''))(t, e)).join('');
ART.scene = scene;
Object.assign(VIZ, {
  scene,
  // oś czasu z punktami
  timeline: (t, v) => { const pts = v.points, n = pts.length, x0 = 90, x1 = 810, X = i => x0 + (x1 - x0) * i / (n - 1), y = v.y || 220;
    return `<g>${v.caption ? T(450, 60, v.caption, { size: 30, w: 800, fill: t.mute, anchor: 'middle', ls: 2 }) : ''}<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${t.soft}" stroke-width="10" stroke-linecap="round"/>
    ${v.dir === 'left' ? arrowD(x1 - 40, y + 190, x0 + 40, y + 190, t.A, 9) + T(450, y + 250, v.dirLabel || 'planujesz od końca', { size: 30, w: 700, fill: t.A, anchor: 'middle' }) : ''}
    ${pts.map((p, i) => `<circle cx="${X(i)}" cy="${y}" r="${p.hl ? 62 : 52}" fill="${p.hl ? t.A : t.paper}" ${p.hl ? '' : `stroke="${t.soft}" stroke-width="6"`}/>${p.icon ? icon(p.icon, X(i) - 34, y - 34, 68, p.hl ? t.onA : INK) : ''}${lines(X(i), y - 96 - ([].concat(p.top || []).length - 1) * 40, [].concat(p.top || []), { size: 34, w: 800, fill: p.hl ? t.A : t.fg, anchor: 'middle', lh: 40 })}${lines(X(i), y + 104, [].concat(p.bottom || []), { size: 30, w: 600, fill: t.mute, anchor: 'middle', lh: 36 })}`).join('')}</g>`; },
  // dwie karty: zła lista vs dobra lista
  listCompare: (t, v) => { const L = v.left, R = v.right, rows = (o, x, good) => o.items.map((s, i) => `${good ? check(x + 50, 150 + i * 80, 24, t.A === INK ? INK : Y, t.A === INK ? Y : INK) : cross(x + 50, 150 + i * 80, 22, t.soft, t.fg)}${T(x + 90, 161 + i * 80, s, { size: 30, w: good ? 700 : 500, fill: good ? (t.A === INK ? INK : INK) : t.mute })}${good ? '' : `<line x1="${x + 88}" y1="${150 + i * 80}" x2="${x + 90 + s.length * 15}" y2="${150 + i * 80}" stroke="${t.mute}" stroke-width="3"/>`}`).join('');
    return `<g>${card(0, 20, 420, 500, t)}${T(40, 86, L.title, { size: 28, w: 800, fill: t.mute, ls: 2 })}${rows(L, 0, false)}
    <rect x="460" y="20" width="440" height="500" rx="26" fill="${t.paper}"/>${T(500, 86, R.title, { size: 28, w: 800, fill: INK, ls: 2 })}${rows(R, 460, true)}</g>`; },
  // tydzień
  week: (t, v) => { const d = v.days, w = 900 / d.length;
    return `<g>${v.caption ? T(450, 50, v.caption, { size: 30, w: 800, fill: t.mute, anchor: 'middle', ls: 2 }) : ''}${d.map((o, i) => { const x = i * w + 8, hl = o.mark === 'hl';
      const iw = Math.min(w - 36, 96); return `<rect x="${x}" y="90" width="${w - 16}" height="340" rx="22" fill="${hl ? t.A : t.card}" stroke="${o.mark === 'ring' ? t.A : t.line}" stroke-width="${o.mark === 'ring' ? 6 : 3}"/>${T(x + (w - 16) / 2, 146, o.d, { size: 30, w: 800, fill: hl ? t.onA : t.mute, anchor: 'middle' })}
      ${o.icon ? icon(o.icon, x + (w - 16) / 2 - iw / 2, 200, iw, hl ? t.onA : (o.dim ? t.soft : t.fg)) : ''}${lines(x + (w - 16) / 2, 360, wrapTxt([].concat(o.label || []).join(' '), Math.max(6, Math.floor((w - 20) / 15))), { size: 26, w: 700, fill: hl ? t.onA : t.fg, anchor: 'middle', lh: 30 })}`; }).join('')}
      ${v.note ? T(450, 500, v.note, { size: 32, w: 700, fill: t.A, anchor: 'middle' }) : ''}</g>`; },
  // słupki poziome
  bars: (t, v) => { const it = v.items, h = Math.min(150, 440 / it.length);
    return `<g>${v.caption ? T(0, 40, v.caption, { size: 28, w: 800, fill: t.mute, ls: 2 }) : ''}${it.map((o, i) => { const y = 80 + i * h, W = 600 * o.v;
      return `${T(0, y + h * .5 + 10, o.label, { size: 30, w: 700, fill: o.hl ? t.A : t.fg })}<rect x="230" y="${y + h * .18}" width="600" height="${h * .62}" rx="${h * .31}" fill="${t.faint}"/><rect x="230" y="${y + h * .18}" width="${Math.max(W, h * .62)}" height="${h * .62}" rx="${h * .31}" fill="${o.hl ? t.A : t.soft}"/>${o.note ? T(230 + Math.max(W, 60) + 20 > 760 ? 230 + W - 20 : 230 + W + 20, y + h * .5 + 10, o.note, { size: 26, w: 800, fill: o.hl && 230 + W + 20 > 760 ? t.onA : t.fg, anchor: 230 + W + 20 > 760 ? 'end' : 'start' }) : ''}`; }).join('')}</g>`; },
  // schody
  stairs: (t, v) => { const n = v.steps.length, sw = 740 / n, sh = 360 / n;
    let d = `M50 470`; v.steps.forEach(() => d += ` h${sw * .35} v${-sh} h${sw * .65}`);
    return `<g><path d="${d} V470 Z" fill="${t.card}"/><path d="${d}" fill="none" stroke="${t.A}" stroke-width="10" stroke-linejoin="round"/>
    ${v.steps.map((s, i) => { const x = 50 + i * sw + sw * .35, y = 470 - (i + 1) * sh; return `${check(x + 40, y + 50, 26, i < (v.done ?? n) ? t.A : t.soft, i < (v.done ?? n) ? t.onA : t.fg)}${lines(x + 10, y - 26 - (wrapTxt(s, 13).length - 1) * 32, wrapTxt(s, 13), { size: 27, w: 700, fill: t.fg, lh: 32 })}`; }).join('')}
    ${v.who ? person(50 + sw * .2 - 20, 470 - 300 * .5, .5, 'walk', t.fig) : ''}${v.top ? icon('flag', 800, 40, 70, t.A) : ''}</g>`; },
  // wykres liniowy
  chart: (t, v) => { const W = 760, H = 380, ox = 80, oy = 440, X = x => ox + x * W, Yv = y => oy - y * H;
    const path = pts => pts.map((p, i) => `${i ? 'L' : 'M'}${X(p[0])} ${Yv(p[1])}`).join(' ');
    return `<g><path d="M${ox} ${oy - H - 20} V${oy} H${ox + W + 20}" fill="none" stroke="${t.soft}" stroke-width="5"/>
    ${(v.series || []).map(s => `<path d="${path(s.pts)}" fill="none" stroke="${s.hl ? t.A : t.fg}" stroke-width="${s.hl ? 12 : 7}" stroke-linecap="round" stroke-linejoin="round" ${s.dash ? 'stroke-dasharray="4 18"' : ''} opacity="${s.hl ? 1 : .7}"/>${s.label ? T(X(s.pts.at(-1)[0]) + (s.la === 'start' ? 16 : 0), Yv(s.pts.at(-1)[1]) - 24, s.label, { size: 28, w: 800, fill: s.hl ? t.A : t.mute, anchor: s.la || 'end' }) : ''}`).join('')}
    ${(v.marks || []).map(m => `<circle cx="${X(m.x)}" cy="${Yv(m.y)}" r="${m.r || 18}" fill="${m.hl ? t.A : t.paper}" stroke="${t.fg}" stroke-width="${m.hl ? 0 : 5}"/>${lines(X(m.x) + (m.dx || 0), Yv(m.y) + (m.dy ?? -36), [].concat(m.label || []), { size: 27, w: 700, fill: m.hl ? t.A : t.fg, anchor: m.anchor || 'middle', lh: 32 })}`).join('')}
    ${v.x ? T(ox + W + 20, oy + 46, v.x, { size: 26, w: 600, fill: t.mute, anchor: 'end' }) : ''}${v.y ? T(ox - 20, oy - H - 30, v.y, { size: 26, w: 600, fill: t.mute }) : ''}</g>`; },
  // kropki narastające co tydzień
  stack: (t, v) => { const cols = v.cols, w = 840 / cols.length;
    return `<g>${cols.map((n, i) => `${[...Array(n)].map((_, j) => `<rect x="${40 + i * w + w * .18}" y="${400 - (j + 1) * 52}" width="${w * .64}" height="44" rx="10" fill="${j === n - 1 && i === cols.length - 1 ? t.A : (j === n - 1 ? t.fig : t.soft)}"/>`).join('')}${T(40 + i * w + w / 2, 450, (v.labels || [])[i] || `${i + 1}`, { size: 26, w: 700, fill: t.mute, anchor: 'middle' })}`).join('')}
    ${v.caption ? T(450, 510, v.caption, { size: 30, w: 800, fill: t.A, anchor: 'middle' }) : ''}</g>`; },
  // myśl stara -> nowa
  bubbleSwap: (t, v) => `<g>${cloud(200, 170, 1.7, t.soft)}${lines(210, 200 - (wrapTxt(v.from, 12).length - 1) * 20, wrapTxt(v.from, 12), { size: 32, w: 700, fill: t.fg, anchor: 'middle', it: 1, lh: 40 })}
    <path d="M70 70 L340 300" stroke="${t.fg}" stroke-width="10" stroke-linecap="round" opacity=".55"/>${v.fromSub ? T(210, 360, v.fromSub, { size: 28, w: 600, fill: t.mute, anchor: 'middle' }) : ''}
    ${arrowD(400, 200, 500, 200, t.fg, 9)}
    <path d="M540 70 a30 30 0 0 1 30 -30 H860 a30 30 0 0 1 30 30 V300 a30 30 0 0 1 -30 30 H660 L600 400 V330 H570 a30 30 0 0 1 -30 -30 Z" fill="${t.A}"/>
    ${lines(715, 185 - (wrapTxt(v.to, 13).length - 1) * 22, wrapTxt(v.to, 13), { size: 36, w: 800, fill: t.onA, anchor: 'middle', lh: 44 })}${v.toSub ? T(715, 470, v.toSub, { size: 28, w: 700, fill: t.A, anchor: 'middle' }) : ''}</g>`,
  // tabela dwóch kolumn
  table: (t, v) => `<g>${T(210, 40, v.left, { size: 28, w: 800, fill: v.good ? t.mute : t.A, anchor: 'middle', ls: 2 })}${T(680, 40, v.right, { size: 28, w: 800, fill: v.good ? t.A : t.mute, anchor: 'middle', ls: 2 })}
    ${v.rows.map(([a, b], i) => { const y = 70 + i * 150; return `<rect x="0" y="${y}" width="420" height="124" rx="24" fill="${t.paper}"/>${lines(210, y + 72 - (wrapTxt(a, 18).length - 1) * 18, wrapTxt(a, 18), { size: 30, w: 700, fill: INK, anchor: 'middle', lh: 36 })}
      ${v.good ? `<rect x="470" y="${y}" width="430" height="124" rx="24" fill="${t.A}"/>${lines(685, y + 72 - (wrapTxt(b, 18).length - 1) * 18, wrapTxt(b, 18), { size: 30, w: 800, fill: t.onA, anchor: 'middle', lh: 36 })}${arrowD(428, y + 62, 462, y + 62, t.fg, 6)}` : `<rect x="470" y="${y}" width="430" height="124" rx="24" fill="none" stroke="${t.soft}" stroke-width="4" stroke-dasharray="12 10"/>${lines(685, y + 72 - (wrapTxt(b, 18).length - 1) * 18, wrapTxt(b, 18), { size: 30, w: 600, fill: t.mute, anchor: 'middle', it: 1, lh: 36 })}`}`; }).join('')}</g>`,
  // przegródki
  sortBins: (t, v) => { const n = v.bins.length, w = (900 - (n - 1) * 30) / n;
    return `<g>${v.bins.map((b, i) => { const x = i * (w + 30); return `<rect x="${x}" y="20" width="${w}" height="500" rx="28" fill="${b.hl ? t.A : t.card}" ${b.hl ? '' : `stroke="${t.line}" stroke-width="3" ${b.dash ? 'stroke-dasharray="14 10"' : ''}`}/>${b.icon ? icon(b.icon, x + w / 2 - 36, 46, 72, b.hl ? t.onA : t.fg) : ''}${T(x + w / 2, b.icon ? 166 : 90, b.title, { size: 30, w: 800, fill: b.hl ? t.onA : t.mute, anchor: 'middle', ls: 2 })}
      ${b.items.map((s, j) => `<rect x="${x + 30}" y="${(b.icon ? 196 : 130) + j * 84}" width="${w - 60}" height="66" rx="16" fill="${b.hl ? (t.A === INK ? Y : INK) : t.cardS}" ${b.dim ? 'opacity=".55"' : ''}/>${T(x + w / 2, (b.icon ? 240 : 174) + j * 84, s, { size: 28, w: 700, fill: b.hl ? (t.A === INK ? INK : Y) : t.fg, anchor: 'middle' })}`).join('')}
      ${b.note ? T(x + w / 2, 490, b.note, { size: 27, w: 700, fill: b.hl ? t.onA : t.mute, anchor: 'middle', it: 1 }) : ''}`; }).join('')}</g>`; },
  // jedna rzecz w świetle, reszta wygaszona
  focus: (t, v) => { const ar = v.around || [], pos = [[120, 110], [780, 110], [110, 430], [790, 430], [450, 40], [450, 510]];
    return `<g><path d="M450 -20 L250 520 L650 520 Z" fill="${t.A}" opacity=".13"/>${ar.map((s, i) => `<g opacity=".5">${T(pos[i][0], pos[i][1], s, { size: 30, w: 600, fill: t.mute, anchor: 'middle' })}</g>`).join('')}
    <circle cx="450" cy="280" r="150" fill="${t.A}"/>${v.icon ? icon(v.icon, 390, 175, 120, t.onA) : ''}${lines(450, v.icon ? 340 : 280 - (wrapTxt(v.center, 10).length - 1) * 20 + 12, wrapTxt(v.center, 10), { size: 36, w: 800, fill: t.onA, anchor: 'middle', lh: 42 })}</g>`; },
  // uwaga ucieka i wraca
  wander: (t, v) => { const ys = [0, -.2, -.9, -.4, 0, .1, .85, .3, 0, -.1], X = i => 60 + i * 86, Yv = y => 270 + y * 170; let d = `M${X(0)} ${Yv(0)}`; for (let i = 1; i < ys.length; i++) d += ` Q${X(i) - 43} ${Yv(ys[i - 1])} ${X(i)} ${Yv(ys[i])}`;
    return `<g><rect x="30" y="230" width="840" height="80" rx="40" fill="${t.A}" opacity=".2"/>${T(870, 220, v.zone || 'zadanie', { size: 28, w: 800, fill: t.A, anchor: 'end' })}
    <path d="${d}" fill="none" stroke="${t.fg}" stroke-width="9" stroke-linecap="round"/>
    ${[[2, -.9, v.out1 || 'odpłynąłem'], [6, .85, v.out2 || 'znowu']].map(([i, y, s]) => `<circle cx="${X(i)}" cy="${Yv(y)}" r="16" fill="${t.fg}"/>${T(X(i), Yv(y) + (y < 0 ? -34 : 56), s, { size: 28, w: 700, fill: t.mute, anchor: 'middle', it: 1 })}`).join('')}
    ${[[4, 0], [8, 0]].map(([i]) => `<circle cx="${X(i)}" cy="${Yv(0)}" r="22" fill="${t.A}"/>`).join('')}${T(X(4), Yv(0) + 70, v.back || 'wracam', { size: 28, w: 800, fill: t.A, anchor: 'middle' })}${T(X(8), Yv(0) + 70, v.back || 'wracam', { size: 28, w: 800, fill: t.A, anchor: 'middle' })}</g>`; },
  // rząd ikon z podpisami
  iconRow: (t, v) => { const n = v.items.length, w = (900 - (n - 1) * 24) / n;
    return `<g>${v.items.map((o, i) => { const x = i * (w + 24); return `<rect x="${x}" y="${v.y || 60}" width="${w}" height="${v.h || 400}" rx="28" fill="${o.hl ? t.A : t.card}" ${o.hl ? '' : `stroke="${t.line}" stroke-width="3"`}/>${icon(o.icon, x + w / 2 - 90, (v.y || 60) + 40, 180, o.hl ? t.onA : t.fg)}${lines(x + w / 2, (v.y || 60) + 290, wrapTxt(o.label, 12), { size: 32, w: 800, fill: o.hl ? t.onA : t.fg, anchor: 'middle', lh: 38 })}${o.sub ? T(x + w / 2, (v.y || 60) + (v.h || 400) - 30, o.sub, { size: 26, w: 600, fill: o.hl ? t.onA : t.mute, anchor: 'middle' }) : ''}`; }).join('')}
    ${v.join ? v.items.slice(1).map((_, i) => T((i + 1) * (w + 24) - 12, (v.y || 60) + (v.h || 400) / 2 + 20, v.join, { size: 56, w: 800, fill: t.A, anchor: 'middle' })).join('') : ''}${v.note ? T(450, 520, v.note, { size: 30, w: 800, fill: t.A, anchor: 'middle' }) : ''}</g>`; },
  // cegły
  bricks: (t, v) => { let s = ''; const rows = 6, bw = 140, bh = 56; for (let r = 0; r < rows; r++) { const n = rows - r, off = 450 - n * (bw + 8) / 2; for (let i = 0; i < n; i++) s += `<rect x="${off + i * (bw + 8)}" y="${470 - (r + 1) * (bh + 8)}" width="${bw}" height="${bh}" rx="8" fill="${r === rows - 1 ? t.A : (r % 2 ? t.soft : t.cardS)}"/>`; }
    return `<g>${s}${icon(v.topIcon || 'trophy', 410, 30, 80, t.A)}${T(450 - 3 * 148 - 20, 444, v.label || 'powtórzenie', { size: 26, w: 700, fill: t.mute })}${v.caption ? T(450, 520, v.caption, { size: 30, w: 800, fill: t.A, anchor: 'middle' }) : ''}</g>`; },
  // centrum + satelity
  hub: (t, v) => { const n = v.items.length;
    return `<g><circle cx="450" cy="270" r="200" fill="none" stroke="${t.soft}" stroke-width="5" stroke-dasharray="14 12"/>${v.items.map((s, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / n, x = 450 + Math.cos(a) * 250, y = 270 + Math.sin(a) * 200; const w = s.length * 17 + 60;
      return `<rect x="${x - w / 2}" y="${y - 36}" width="${w}" height="72" rx="36" fill="${i === (v.hl ?? 0) ? t.A : t.cardS}"/>${T(x, y + 11, s, { size: 30, w: 800, fill: i === (v.hl ?? 0) ? t.onA : t.fg, anchor: 'middle' })}`; }).join('')}
    <circle cx="450" cy="270" r="130" fill="${t.paper}"/>${icon(v.icon || 'dumbbell', 405, 175, 90, INK)}${lines(450, 300, wrapTxt(v.center, 11), { size: 30, w: 800, fill: INK, anchor: 'middle', lh: 36 })}</g>`; },
  // ciało z sygnałami
  bodyMap: (t, v) => { const J = { head: [450, 86], jaw: [450, 118], face: [470, 76], chest: [450, 205], hands: [497, 296], lhand: [403, 296], stomach: [450, 260], shoulders: [490, 152], legs: [440, 430] };
    return `<g>${person(260, 10, .95, 'stand', t.fig)}${v.points.map((p, i) => { const [x, y] = J[p.part] || [450, 200], side = p.side ?? (i % 2), lx = side ? 880 : 20, ly = p.ly ?? y; return `<path d="M${x} ${y} L${side ? x + 60 : x - 60} ${ly} H${side ? lx - p.label.length * 17 - 10 : lx + p.label.length * 17 + 10}" fill="none" stroke="${t.A === INK ? INK : Y}" stroke-width="4"/><circle cx="${x}" cy="${y}" r="18" fill="${t.A}" stroke="${t.fig === '#fff' ? '#2c2c30' : '#fff'}" stroke-width="5"/>${T(lx, ly + 10, p.label, { size: 30, w: 800, fill: t.fg, anchor: side ? 'end' : 'start' })}`; }).join('')}</g>`; },
  // przepływ: chmura -> strzałka -> cel
  arrowFlow: (t, v) => `<g>${cloud(170, 220, 1.5, t.soft)}${lines(180, 250 - (wrapTxt(v.from, 9).length - 1) * 18, wrapTxt(v.from, 9), { size: 32, w: 800, fill: t.fg, anchor: 'middle', lh: 38 })}${v.fromSub ? T(180, 400, v.fromSub, { size: 28, w: 600, fill: t.mute, anchor: 'middle' }) : ''}
    <path d="M330 240 C420 140 520 140 590 230" fill="none" stroke="${t.A}" stroke-width="12" stroke-linecap="round"/><path d="M560 200 L594 236 L548 246" fill="none" stroke="${t.A}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>${v.via ? T(460, 130, v.via, { size: 30, w: 800, fill: t.A, anchor: 'middle' }) : ''}
    ${v.toIcon === 'paper' ? `<rect x="610" y="120" width="250" height="320" rx="20" fill="${t.paper}" transform="rotate(4 735 280)"/>${[0, 1, 2, 3].map(i => `<rect x="650" y="${190 + i * 56}" width="${170 - i * 26}" height="16" rx="8" fill="${INK}" opacity=".25" transform="rotate(4 735 280)"/>`).join('')}` : `<circle cx="735" cy="270" r="150" fill="none" stroke="${t.A}" stroke-width="12"/><circle cx="735" cy="270" r="95" fill="none" stroke="${t.A}" stroke-width="12"/><circle cx="735" cy="270" r="40" fill="${t.A}"/>`}
    ${v.to ? T(735, 500, v.to, { size: 32, w: 800, fill: t.A, anchor: 'middle' }) : ''}</g>`,
  // dwie karty z ikonami
  twoCards: (t, v) => { const c = (o, x, hl) => `<rect x="${x}" y="20" width="430" height="500" rx="30" fill="${hl ? t.A : t.card}" ${hl ? '' : `stroke="${t.line}" stroke-width="3"`}/>${icon(o.icon, x + 135, 70, 160, hl ? t.onA : t.soft)}${o.cross ? `<path d="M${x + 120} 70 L${x + 310} 240" stroke="${t.fg}" stroke-width="10" stroke-linecap="round"/>` : ''}${lines(x + 215, 320, wrapTxt(o.label, 14), { size: 36, w: 800, fill: hl ? t.onA : t.mute, anchor: 'middle', lh: 44 })}${o.sub ? lines(x + 215, 440, wrapTxt(o.sub, 22), { size: 27, w: 600, fill: hl ? t.onA : t.mute, anchor: 'middle', lh: 34, it: 1 }) : ''}`;
    return `<g>${c(v.left, 0, false)}${c(v.right, 470, true)}</g>`; },
  // notatka
  notes: (t, v) => `<g><g transform="rotate(-3 300 270)"><rect x="40" y="30" width="540" height="480" rx="24" fill="${t.paper}"/>${[...Array(7)].map((_, i) => `<line x1="80" y1="${150 + i * 54}" x2="540" y2="${150 + i * 54}" stroke="${INK}" stroke-opacity=".1" stroke-width="3"/>`).join('')}
    ${T(80, 104, v.title || 'NOTATKA', { size: 28, w: 800, fill: INK, ls: 3 })}${v.lines.map((s, i) => T(80, 194 + i * 108, '– ' + s, { size: 34, w: 600, fill: INK, it: 1 })).join('')}</g>
    ${(v.crossed || []).map((s, i) => { const w = s.length * 18 + 50; return `<g transform="translate(${640},${100 + i * 140}) rotate(${i % 2 ? 5 : -4})"><rect width="${w}" height="76" rx="38" fill="${t.soft}"/>${T(w / 2, 50, s, { size: 30, w: 700, fill: t.fg, anchor: 'middle' })}<line x1="10" y1="38" x2="${w - 10}" y2="38" stroke="${t.fg}" stroke-width="5"/></g>`; }).join('')}
    ${v.side ? T(760, 480, v.side, { size: 28, w: 800, fill: t.A, anchor: 'middle' }) : ''}</g>`,
  // siatka 2x2
  grid4: (t, v) => `<g>${v.items.map((o, i) => { const x = (i % 2) * 460, y = Math.floor(i / 2) * 270; return `<rect x="${x}" y="${y}" width="440" height="250" rx="28" fill="${o.ok === false ? t.card : t.cardS}" stroke="${o.ok === false ? t.A : t.line}" stroke-width="${o.ok === false ? 6 : 3}"/>${icon(o.icon || 'star', x + 40, y + 40, 80, o.ok === false ? t.A : t.fg)}${T(x + 40, y + 190, o.label, { size: 36, w: 800, fill: t.fg })}${o.ok === false ? cross(x + 380, y + 70, 30, t.A, t.onA) : check(x + 380, y + 70, 30, t.soft, t.fg)}${o.sub ? T(x + 40, y + 228, o.sub, { size: 24, w: 600, fill: t.mute }) : ''}`; }).join('')}</g>`,
  // skala z punktami
  scale10: (t, v) => { const x0 = 60, x1 = 840, X = n => x0 + (x1 - x0) * (n - (v.min ?? 1)) / ((v.max ?? 10) - (v.min ?? 1));
    return `<g>${v.caption ? T(x0, 40, v.caption, { size: 26, w: 800, fill: t.mute, ls: 3 }) : ''}<defs><linearGradient id="sg" x1="0" x2="1"><stop offset="0" stop-color="${t.fg}" stop-opacity=".15"/><stop offset="1" stop-color="${t.A}"/></linearGradient></defs>
    <rect x="${x0}" y="${v.y || 220}" width="${x1 - x0}" height="40" rx="20" fill="url(#sg)"/>${[...Array((v.max ?? 10) - (v.min ?? 1) + 1)].map((_, i) => T(X(i + (v.min ?? 1)), (v.y || 220) + 90, String(i + (v.min ?? 1)), { size: 28, w: 700, fill: t.mute, anchor: 'middle' })).join('')}
    ${v.points.map(p => `<circle cx="${X(p.n)}" cy="${(v.y || 220) + 20}" r="${p.hl ? 36 : 26}" fill="${p.hl ? t.A : t.paper}" stroke="${p.hl ? t.fg : 'none'}" stroke-width="6"/>${lines(X(p.n), (v.y || 220) - 40 - ([].concat(p.label).length - 1) * 34, [].concat(p.label), { size: p.hl ? 30 : 26, w: p.hl ? 800 : 600, fill: p.hl ? t.A : t.mute, anchor: 'middle', lh: 34 })}`).join('')}
    ${v.arrow ? `<path d="M${X(v.arrow[0])} ${(v.y || 220) + 140} H${X(v.arrow[1]) + (v.arrow[1] > v.arrow[0] ? -14 : 14)}" stroke="${t.A}" stroke-width="8" stroke-linecap="round"/><path d="M${X(v.arrow[1]) + (v.arrow[1] > v.arrow[0] ? -30 : 30)} ${(v.y || 220) + 122} L${X(v.arrow[1])} ${(v.y || 220) + 140} L${X(v.arrow[1]) + (v.arrow[1] > v.arrow[0] ? -30 : 30)} ${(v.y || 220) + 158}" fill="none" stroke="${t.A}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>${T((X(v.arrow[0]) + X(v.arrow[1])) / 2, (v.y || 220) + 200, v.arrowLabel || '', { size: 30, w: 800, fill: t.A, anchor: 'middle' })}` : ''}
    ${v.note ? T(450, 520, v.note, { size: 30, w: 700, fill: t.fg, anchor: 'middle' }) : ''}</g>`; },
  // oddech: fala wdech / wydech
  breath: (t, v) => { const a = v.inN || 4, b = v.outN || 6, tot = a + b, W = 800, xa = 50 + W * a / tot;
    return `<g><path d="M50 420 C${50 + (xa - 50) * .5} 420 ${50 + (xa - 50) * .5} 120 ${xa} 120 C${xa + (850 - xa) * .5} 120 ${xa + (850 - xa) * .5} 420 850 420" fill="none" stroke="${t.A}" stroke-width="14" stroke-linecap="round"/>
    ${T((50 + xa) / 2 + 30, 400, v.inL || 'wdech', { size: 34, w: 800, fill: t.fg, anchor: 'middle' })}${T((xa + 850) / 2 - 30, 400, v.outL || 'wydech', { size: 34, w: 800, fill: t.A, anchor: 'middle' })}
    <rect x="50" y="470" width="${xa - 60}" height="20" rx="10" fill="${t.soft}"/><rect x="${xa + 10}" y="470" width="${850 - xa - 10}" height="20" rx="10" fill="${t.A}"/>${T((50 + xa) / 2, 530, v.inT || 'krócej', { size: 28, w: 700, fill: t.mute, anchor: 'middle' })}${T((xa + 850) / 2, 530, v.outT || 'dłużej', { size: 28, w: 800, fill: t.A, anchor: 'middle' })}</g>`; },
});
// END: nazwa albo {items:[...]} w viewBox 400x300
Object.assign(END, { scene: (t, e) => scene(t, e) });

// ---------- składanie slajdów ----------
const PAD = 96;
const foot = (t, i, swipe) => `<div class="ft" style="color:${t.mute}">@psychologsportowy · ${i}/5</div>${swipe ? `<div class="sw" style="color:${t.A}">przesuń <span>→</span></div>` : ''}`;
const titleSize = (s, base) => { const n = plainLen(s); return n <= 14 ? base : n <= 18 ? base - 8 : n <= 22 ? base - 16 : base - 24; };
const kick = (t, s) => s ? `<div class="kick" style="color:${t.A === INK ? INK : Y}"><span style="background:${t.A};color:${t.onA}">${escH(s)}</span></div>` : '';

function cover(t, c) {
  const art = (ART[c.art.type] || VIZ[c.art.type])(t, c.art);
  const ts = c.size || titleSize(c.title, 104);
  const pre = c.pre ? `<div class="pre" style="color:${t.mute}">${rich(c.pre)}</div>` : '';
  const title = pre + `<div class="h" style="font-size:${ts}px;color:${t.fg}${c.italic ? ';font-style:italic' : ''}">${rich(c.title)}</div>`;
  const sub = c.sub ? `<div class="sub" style="color:${t.mute}">${rich(c.sub)}</div>` : '';
  if (c.layout === 'top') return `<div class="box" style="top:110px">${kick(t, c.kicker)}${title}${sub}</div>
    <svg class="art" viewBox="0 0 900 620" style="top:${c.artTop || 590}px;height:${c.artH || 560}px">${art}</svg>`;
  if (c.layout === 'split') return `<div class="lab" style="left:${PAD}px;width:436px;color:${t.mute}">${escH(c.left || 'PRZED')}</div><div class="lab" style="left:${PAD + 464}px;width:436px;color:${t.A}">${escH(c.right || 'PO')}</div>
    <svg class="art" viewBox="0 0 900 620" style="top:170px;height:${c.artH || 580}px">${art}</svg>
    <div class="box" style="top:${c.titleTop || 840}px">${title}${sub}</div>`;
  if (c.layout === 'big') return `<div class="box" style="top:120px"><div style="font:800 ${c.bigSize || 420}px/0.9 P;color:${t.A};letter-spacing:-8px;margin-bottom:${c.bigSub ? 8 : 24}px">${escH(c.big)}</div>${c.bigSub ? `<div class="sub" style="color:${t.mute};margin:0 0 30px">${escH(c.bigSub)}</div>` : ''}${title}${sub}</div>
    <svg class="art" viewBox="${c.vb || '0 0 900 620'}" style="top:${c.artTop || 790}px;height:${c.artH || 400}px">${art}</svg>`;
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
    <svg viewBox="0 0 400 300" style="width:400px;height:300px;margin-bottom:60px">${typeof e.art === 'object' ? scene(t, e.art) : END[e.art || 'think'](t)}</svg>
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
