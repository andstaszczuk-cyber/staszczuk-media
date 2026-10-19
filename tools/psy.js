// @psychologsportowy: tiles 1080x1350 in three candidate styles + grid mockups.
// Usage: node psy.js spec.json outDir   (spec: {tiles:[{kind:"text"|"reel", theme:"grafit|zolty|granat|krem|bordo", text:"... *wyróżnione* ..."}]})
const fs = require('fs');
const path = require('path');
const F = p => 'file://' + path.join(__dirname, 'node_modules/@fontsource', p);
const font = `
@font-face{font-family:P;font-weight:800;src:url(${F('poppins/files/poppins-latin-ext-800-normal.woff2')});unicode-range:U+0100-024F,U+1E00-1EFF}
@font-face{font-family:P;font-weight:800;src:url(${F('poppins/files/poppins-latin-800-normal.woff2')})}
@font-face{font-family:P;font-weight:600;src:url(${F('poppins/files/poppins-latin-ext-600-normal.woff2')});unicode-range:U+0100-024F,U+1E00-1EFF}
@font-face{font-family:P;font-weight:600;src:url(${F('poppins/files/poppins-latin-600-normal.woff2')})}
@font-face{font-family:P;font-weight:500;src:url(${F('poppins/files/poppins-latin-ext-500-normal.woff2')});unicode-range:U+0100-024F,U+1E00-1EFF}
@font-face{font-family:P;font-weight:500;src:url(${F('poppins/files/poppins-latin-500-normal.woff2')})}`;
const Y = '#FCE86A';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const hl = (s, cls = 'y') => esc(s).split('\\n').join('\n').split('\n').map(l => l.replace(/\*(.+?)\*/g, `<span class="${cls}">$1</span>`)).join('<br>');
const plain = s => String(s).replace(/\*/g, '');
const size = s => { const n = plain(s).length; return n < 16 ? 104 : n < 26 ? 92 : n < 40 ? 82 : 74; };

// person silhouette for reel placeholders (the real cover = frame from his daily video)
const person = (c) => `<svg viewBox="0 0 400 520" width="760" style="position:absolute;left:160px;bottom:0;opacity:.9">
  <circle cx="200" cy="150" r="92" fill="${c}"/><path d="M30 520 C40 330 110 270 200 270 C290 270 360 330 370 520 Z" fill="${c}"/></svg>`;

const TH = {
  grafit: { bg: 'radial-gradient(110% 80% at 50% 38%,#4b4b4f 0%,#26262a 45%,#121214 100%)', fg: '#fff', acc: Y, ft: '#ffffffa8' },
  zolty: { bg: Y, fg: '#151515', acc: '#151515', mark: true, ft: '#151515a0' },
  granat: { bg: 'radial-gradient(110% 80% at 50% 35%,#2f4470 0%,#1b2846 50%,#0f1729 100%)', fg: '#fff', acc: Y, ft: '#ffffffa8' },
  krem: { bg: '#F1EBDF', fg: '#1d1b19', acc: '#1d1b19', hl: true, ft: '#1d1b1999' },
  bordo: { bg: 'radial-gradient(110% 80% at 50% 35%,#8a3a3e 0%,#5e2427 55%,#3c1618 100%)', fg: '#fff', acc: Y, ft: '#ffffffa8' },
};
const textTile = (t, th) => {
  const T = TH[th];
  const cls = T.mark ? 'u' : T.hl ? 'mk' : 'y';
  return `<body style="background:${T.bg}"><div class="c"><div class="h" style="font-size:${size(t)}px;color:${T.fg}">${hl(t, cls)}</div></div>${foot(T.ft)}</body>`;
};
// --- layouts for variety (all respect 150px side margins) ---
const ICONS = {
  target: c => `<circle cx="100" cy="100" r="80" fill="none" stroke="${c}" stroke-width="10"/><circle cx="100" cy="100" r="48" fill="none" stroke="${c}" stroke-width="10"/><circle cx="100" cy="100" r="14" fill="${c}"/><path d="M100 100 L176 24 M150 22 h28 v28" fill="none" stroke="${c}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`,
  battery: c => `<rect x="20" y="60" width="150" height="80" rx="14" fill="none" stroke="${c}" stroke-width="10"/><rect x="172" y="84" width="14" height="32" rx="4" fill="${c}"/><rect x="36" y="76" width="30" height="48" rx="5" fill="${c}"/>`,
  pulse: c => `<path d="M10 110 H60 L80 60 L105 160 L130 40 L150 110 H190" fill="none" stroke="${c}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`,
  runner: c => `<circle cx="122" cy="32" r="18" fill="${c}"/><path d="M110 60 L78 104 L40 100 M100 74 L132 98 L160 84 M90 92 L112 136 L88 180 M112 136 L150 150 L162 186" fill="none" stroke="${c}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`,
  flag: c => `<path d="M20 180 L70 90 L100 130 L130 70 L180 180 Z" fill="none" stroke="${c}" stroke-width="10" stroke-linejoin="round"/><path d="M130 70 V20 L165 32 L130 44" fill="none" stroke="${c}" stroke-width="8" stroke-linejoin="round"/>`,
  head: c => `<path d="M70 190 V150 C40 140 28 112 30 84 C34 40 70 12 110 14 C150 16 176 46 174 84 L188 112 H172 V138 C172 150 162 156 150 156 H130 V190" fill="none" stroke="${c}" stroke-width="10" stroke-linejoin="round"/><path d="M98 86 a14 14 0 1 1 14 14 a28 28 0 1 1 -28 -28" fill="none" stroke="${c}" stroke-width="8" stroke-linecap="round"/>`,
};

Object.assign(ICONS, {
  stairs: c => `<path d="M20 180 H60 V140 H100 V100 H140 V60 H180 V20" fill="none" stroke="${c}" stroke-width="10" stroke-linejoin="round"/><circle cx="62" cy="112" r="12" fill="${c}"/><path d="M62 124 V150 M50 136 L74 134" stroke="${c}" stroke-width="8" stroke-linecap="round"/>`,
  foot: c => `<ellipse cx="70" cy="120" rx="26" ry="44" fill="none" stroke="${c}" stroke-width="10"/><ellipse cx="135" cy="70" rx="24" ry="40" fill="none" stroke="${c}" stroke-width="10"/><path d="M60 180 h20 M126 124 h18" stroke="${c}" stroke-width="10" stroke-linecap="round"/>`,
  growth: c => `<path d="M20 180 H185 M20 180 V20" stroke="${c}" stroke-width="8" stroke-linecap="round" opacity=".6"/><path d="M35 150 L80 110 L110 130 L170 50" fill="none" stroke="${c}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/><path d="M140 48 H172 V80" fill="none" stroke="${c}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`,
  trophy: c => `<path d="M60 25 H140 V80 a40 40 0 0 1 -80 0 Z" fill="none" stroke="${c}" stroke-width="10" stroke-linejoin="round"/><path d="M60 40 H30 a28 28 0 0 0 34 40 M140 40 H170 a28 28 0 0 1 -34 40 M100 120 V150 M68 178 H132 M80 150 H120 V178" fill="none" stroke="${c}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`,
  person: c => `<circle cx="100" cy="60" r="32" fill="none" stroke="${c}" stroke-width="10"/><path d="M35 185 C40 130 70 108 100 108 C130 108 160 130 165 185" fill="none" stroke="${c}" stroke-width="10" stroke-linecap="round"/>`,
  heart: c => `<path d="M100 178 C40 130 18 100 22 66 C26 36 52 22 74 26 C88 28 96 38 100 48 C104 38 112 28 126 26 C148 22 174 36 178 66 C182 100 160 130 100 178 Z" fill="none" stroke="${c}" stroke-width="10" stroke-linejoin="round"/>`,
  coins: c => `<ellipse cx="100" cy="50" rx="60" ry="20" fill="none" stroke="${c}" stroke-width="10"/><path d="M40 50 V90 c0 11 27 20 60 20 s60-9 60-20 V50 M40 90 V130 c0 11 27 20 60 20 s60-9 60-20 V90" fill="none" stroke="${c}" stroke-width="10"/>`,
  flags: c => `<path d="M40 185 V25 M40 30 H110 L95 55 L110 80 H40" fill="none" stroke="${c}" stroke-width="10" stroke-linejoin="round" stroke-linecap="round"/><path d="M120 185 V95 M120 100 H175 L162 120 L175 140 H120" fill="none" stroke="${c}" stroke-width="10" stroke-linejoin="round" stroke-linecap="round" opacity=".65"/>`,
  tag: c => `<path d="M100 20 H175 V95 L95 175 L20 100 Z" fill="none" stroke="${c}" stroke-width="10" stroke-linejoin="round"/><circle cx="145" cy="50" r="12" fill="${c}"/>`,
  check: c => `<rect x="25" y="25" width="150" height="150" rx="20" fill="none" stroke="${c}" stroke-width="10"/><path d="M60 100 L90 130 L145 70" fill="none" stroke="${c}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>`,
  compare: c => `<circle cx="65" cy="70" r="24" fill="none" stroke="${c}" stroke-width="9" opacity=".55"/><path d="M25 175 C30 135 45 115 65 115 C85 115 100 135 105 175" fill="none" stroke="${c}" stroke-width="9" opacity=".55"/><circle cx="140" cy="55" r="26" fill="none" stroke="${c}" stroke-width="10"/><path d="M95 175 C100 125 118 100 140 100 C162 100 180 125 185 175" fill="none" stroke="${c}" stroke-width="10"/>`,
  cloud: c => `<path d="M55 130 a32 32 0 0 1 4 -64 a44 44 0 0 1 84 10 a28 28 0 0 1 2 54 Z" fill="none" stroke="${c}" stroke-width="10" stroke-linejoin="round"/><path d="M70 155 L60 180 M105 155 L95 180 M140 155 L130 180" stroke="${c}" stroke-width="10" stroke-linecap="round"/>`,
  scale: c => `<path d="M100 25 V175 M60 175 H140 M30 55 H170" stroke="${c}" stroke-width="10" stroke-linecap="round"/><path d="M30 55 L10 115 H50 Z M170 55 L150 115 H190 Z" fill="none" stroke="${c}" stroke-width="9" stroke-linejoin="round"/>`,
  tools: c => `<path d="M45 155 L120 80 M120 80 a28 28 0 1 0 -6 -40 l-18 18 l10 22 l22 10 l18 -18" fill="none" stroke="${c}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><circle cx="45" cy="155" r="14" fill="none" stroke="${c}" stroke-width="10"/>`,
  gauge: c => `<path d="M25 140 a75 75 0 0 1 150 0" fill="none" stroke="${c}" stroke-width="12" stroke-linecap="round"/><path d="M100 140 L140 80" stroke="${c}" stroke-width="10" stroke-linecap="round"/><circle cx="100" cy="140" r="12" fill="${c}"/><path d="M40 170 H160" stroke="${c}" stroke-width="8" stroke-linecap="round" opacity=".5"/>`,
  wind: c => `<path d="M20 70 H130 a22 22 0 1 0 -22 -22 M20 110 H160 a22 22 0 1 1 -22 22 M20 150 H90" fill="none" stroke="${c}" stroke-width="10" stroke-linecap="round"/>`,
  people: c => `<circle cx="60" cy="70" r="22" fill="none" stroke="${c}" stroke-width="9"/><circle cx="140" cy="70" r="22" fill="none" stroke="${c}" stroke-width="9"/><circle cx="100" cy="55" r="26" fill="none" stroke="${c}" stroke-width="10"/><path d="M50 175 C55 125 75 100 100 100 C125 100 145 125 150 175 M15 165 C18 130 35 110 60 110 M185 165 C182 130 165 110 140 110" fill="none" stroke="${c}" stroke-width="9" stroke-linecap="round"/>`,
  dumbbell: c => `<path d="M55 100 H145" stroke="${c}" stroke-width="12" stroke-linecap="round"/><rect x="30" y="60" width="25" height="80" rx="6" fill="none" stroke="${c}" stroke-width="10"/><rect x="145" y="60" width="25" height="80" rx="6" fill="none" stroke="${c}" stroke-width="10"/><path d="M15 80 V120 M185 80 V120" stroke="${c}" stroke-width="10" stroke-linecap="round"/>`,
  bubble: c => `<path d="M30 40 H170 a14 14 0 0 1 14 14 V130 a14 14 0 0 1 -14 14 H90 L55 175 V144 H30 a14 14 0 0 1 -14 -14 V54 a14 14 0 0 1 14 -14 Z" fill="none" stroke="${c}" stroke-width="10" stroke-linejoin="round"/><path d="M85 75 a16 16 0 1 1 22 15 c-6 3 -7 6 -7 12" fill="none" stroke="${c}" stroke-width="9" stroke-linecap="round"/><circle cx="100" cy="120" r="6" fill="${c}"/>`,
});

const L = {
  quote: (s, T, cls) => `<div class="c" style="align-items:flex-start;text-align:left">
    <div style="font:600 30px P;letter-spacing:3px;color:${T.ft};margin-bottom:36px">CZĘSTO SŁYSZĘ W GABINECIE</div>
    <div style="font:800 260px/1 Georgia,serif;color:${T.mark ? T.fg : Y};height:130px;overflow:hidden;margin:0 0 30px -8px">“</div>
    <div class="h" style="font-size:${size(s.text) - 6}px;color:${T.fg}">${hl(s.text, cls)}</div></div>`,
  number: (s, T, cls) => `<div class="c" style="align-items:flex-start;text-align:left">
    <div style="font:800 300px/0.9 P;color:${T.mark ? T.fg : Y};letter-spacing:-8px">${s.n || (s.items || []).length}</div>
    <div class="h" style="font-size:${size(s.text) - 14}px;color:${T.fg};margin:10px 0 40px">${hl(s.text, cls)}</div>
    ${(s.items || []).map(it => `<div style="font:600 46px/1.3 P;color:${T.fg};opacity:.92;padding:20px 0;border-top:3px solid ${T.ft};width:100%">${esc(it)}</div>`).join('')}</div>`,
  versus: (s, T, cls) => `<div class="c">
    <div style="font:600 58px/1.25 P;color:${T.fg};opacity:.55;text-decoration:line-through;text-decoration-thickness:6px">${esc(s.old)}</div>
    <svg viewBox="0 0 40 60" width="60" style="margin:44px 0"><path d="M20 4 V52 M6 38 L20 54 L34 38" fill="none" stroke="${T.mark ? T.fg : Y}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <div class="h" style="font-size:${size(s.text)}px;color:${T.fg}">${hl(s.text, cls)}</div></div>`,
  question: (s, T, cls) => `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:800 1100px/1 P;color:${T.mark ? '#00000014' : '#ffffff10'}">?</div>
    <div class="c"><div class="h" style="font-size:${size(s.text)}px;color:${T.fg}">${hl(s.text, cls)}</div></div>`,
  icon: (s, T, cls) => `<div class="c"><svg viewBox="0 0 200 200" width="300" style="margin-bottom:60px">${ICONS[s.icon || 'target'](T.mark ? T.fg : Y)}</svg>
    <div class="h" style="font-size:${size(s.text) - 6}px;color:${T.fg}">${hl(s.text, cls)}</div></div>`,
  myth: (s, T, cls) => `<div class="c"><div style="font:800 40px P;letter-spacing:6px;color:${T.mark ? Y : '#151515'};background:${T.mark ? '#151515' : Y};padding:14px 34px;border-radius:8px;margin-bottom:56px">MIT</div>
    <div class="h" style="font-size:${size(s.text) - 4}px;color:${T.fg}">${hl(s.text, cls)}</div>
    <div style="font:600 34px P;color:${T.ft};margin-top:50px">${esc(s.sub || '')}</div></div>`,
  chart: (s, T, cls) => { const c = T.mark ? T.fg : Y, f = T.fg;
    return `<div class="c"><div class="h" style="font-size:${size(s.text) - 12}px;color:${f};margin-bottom:60px">${hl(s.text, cls)}</div>
    <svg viewBox="0 -60 700 500" width="700"><path d="M60 20 V380 H680" fill="none" stroke="${f}" stroke-opacity=".5" stroke-width="5"/>
    <path d="M80 360 C220 360 260 90 370 90 C480 90 520 360 660 360" fill="none" stroke="${c}" stroke-width="12" stroke-linecap="round"/>
    <circle cx="370" cy="90" r="20" fill="${c}"/>
    <text x="370" y="45" text-anchor="middle" font-family="P" font-weight="600" font-size="30" fill="${f}">twoja strefa</text>
    <text x="680" y="425" text-anchor="end" font-family="P" font-weight="600" font-size="28" fill="${f}" opacity=".7">pobudzenie →</text>
    <text x="40" y="40" text-anchor="end" font-family="P" font-weight="600" font-size="28" fill="${f}" opacity=".7" transform="rotate(-90 40 40)" dx="-10">wykonanie</text></svg></div>`; },
};
L.point = (s, T, cls) => { const c = T.mark ? T.fg : Y;
  return `<div class="c" style="align-items:flex-start;text-align:left">
    <div style="display:flex;align-items:center;gap:40px;margin-bottom:46px">
      <svg viewBox="0 0 200 200" width="220">${ICONS[s.icon || 'target'](c)}</svg>
      <div style="font:800 150px/1 P;color:${c}">${s.n}</div></div>
    <div class="h" style="font-size:72px;color:${T.fg};margin-bottom:34px">${hl(s.title, cls)}</div>
    <div style="font:500 46px/1.45 P;color:${T.fg};opacity:.92">${esc(s.body)}</div></div>`; };
L.end = (s, T, cls) => { const c = T.mark ? T.fg : Y;
  return `<div class="c"><svg viewBox="0 0 200 200" width="240" style="margin-bottom:56px">${ICONS[s.icon || 'bubble'](c)}</svg>
    <div class="h" style="font-size:${size(s.text)}px;color:${T.fg}">${hl(s.text, cls)}</div>
    <div style="width:140px;height:10px;background:${c};border-radius:5px;margin:56px 0 44px"></div>
    <div style="font:600 40px/1.4 P;color:${T.fg};opacity:.85">${esc(s.cta || 'Zapisz, żeby wrócić przed startem.')}</div></div>`; };
const layoutTile = (s) => {
  const T = TH[s.theme || 'grafit'];
  const cls = T.mark ? 'u' : T.hl ? 'mk' : 'y';
  if (!s.layout || s.layout === 'text') return textTile(s.text, s.theme || 'grafit');
  return `<body style="background:${T.bg}">${L[s.layout](s, T, cls)}${foot(T.ft)}</body>`;
};
const reelTile = t => `<body style="background:linear-gradient(180deg,#5a5c62 0%,#2a2b2f 60%,#18181a 100%)">${person('#0f0f11')}
  <div style="position:absolute;left:150px;right:150px;bottom:230px;text-align:center"><div class="h cap" style="font-size:${Math.min(84, size(t) - 6)}px;line-height:1.18">${hl(t, 'yb')}</div></div>${play()}</body>`;
let CUR = {};
function foot(c) {
  const pg = CUR.total > 1 ? ` · ${CUR.idx}/${CUR.total}` : '';
  const sw = CUR.total > 1 && CUR.idx === 1 ? `<div style="position:absolute;right:150px;bottom:90px;font:600 28px P;color:${c}">przesuń →</div>` : '';
  const al = sw ? 'left:150px;text-align:left' : 'left:0;right:0;text-align:center';
  return `<div style="position:absolute;${al};bottom:90px;font:600 28px P;color:${c};letter-spacing:.5px">@psychologsportowy${pg}</div>${sw}`;
}
function play() {
  return `<svg viewBox="0 0 24 24" width="56" style="position:absolute;right:70px;top:70px"><path d="M7 4v16l13-8z" fill="#fff" opacity=".9"/></svg>`;
}
function doc(body) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${font}
  html,body{margin:0;width:1080px;height:1350px;overflow:hidden;position:relative}
  .c{position:absolute;top:150px;bottom:190px;left:150px;right:150px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center}
  .h{font-family:P;font-weight:800;line-height:1.2;letter-spacing:-.5px}
  .y{color:${Y}} .k{color:${Y};background:#111;padding:0 .14em;-webkit-box-decoration-break:clone;box-decoration-break:clone}
  .mk{background:linear-gradient(180deg,transparent 55%,${Y} 55%,${Y} 92%,transparent 92%);padding:0 .06em} .u{text-decoration:underline;text-decoration-thickness:.09em;text-underline-offset:.14em}
  .cap{color:#fff;text-shadow:0 4px 18px rgba(0,0,0,.55)} .yb{color:${Y}}
  </style></head>${body}</html>`;
}

async function main() {
  const [, , specPath, outDir] = process.argv;
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  fs.mkdirSync(outDir, { recursive: true });
  const { chromium } = require('playwright');
  const g = fs.readdirSync('/opt/pw-browsers').filter(d => d.startsWith('chromium_headless_shell')).sort().reverse();
  const b = await chromium.launch({ executablePath: `/opt/pw-browsers/${g[0]}/chrome-linux/headless_shell`, args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  const tmp = path.join(__dirname, `.tmp-${process.pid}.html`);
    for (const [i, t] of spec.tiles.entries()) {
    CUR = { idx: t.idx || 1, total: t.total || 1 };
    const html = doc(t.kind === 'reel' ? reelTile(t.text) : layoutTile(t));
    fs.writeFileSync(tmp, html);
    await p.goto('file://' + tmp);
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(outDir, `${i + 1}.png`) });
  }
  fs.unlinkSync(tmp);
  await b.close();
}
main();
