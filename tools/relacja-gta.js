// Relacje IG 1080x1920 na premierę GTA 6 (bez logo i grafik z gry, własny klimat neonowego miasta nocą).
// Użycie: node relacja-gta.js <katalog_wyjscia>
const path = require('path');
const { render } = require('./kit');
const F = p => 'file://' + path.join(__dirname, 'node_modules/@fontsource', p);
const font = ['600', '700', '800'].map(w => `
@font-face{font-family:Pop;font-weight:${w};src:url(${F(`poppins/files/poppins-latin-ext-${w}-normal.woff2`)}) format('woff2');unicode-range:U+0100-024F}
@font-face{font-family:Pop;font-weight:${w};src:url(${F(`poppins/files/poppins-latin-${w}-normal.woff2`)}) format('woff2')}`).join('')
  + `@font-face{font-family:Ant;src:url(${F('anton/files/anton-latin-ext-400-normal.woff2')}) format('woff2');unicode-range:U+0100-024F}
@font-face{font-family:Ant;src:url(${F('anton/files/anton-latin-400-normal.woff2')}) format('woff2')}`;

const PINK = '#FF3D8B', ORANGE = '#FFB23F', TEAL = '#3EE6D6', RED = '#C42332';
const bg = `linear-gradient(180deg,#1A0B2E 0%,#3A0F4A 38%,#8A1E5A 62%,#E0533F 82%,#FFB23F 100%)`;

// sylwetka miasta + palmy
const city = `<svg viewBox="0 0 1080 520" width="1080" height="520" style="position:absolute;left:0;bottom:0">
<circle cx="540" cy="330" r="210" fill="url(#sun)"/>
<defs><linearGradient id="sun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFD36B"/><stop offset="1" stop-color="#FF3D8B"/></linearGradient></defs>
${[0, 1, 2, 3, 4, 5].map(i => `<rect x="300" y="${350 + i * 26}" width="480" height="${4 + i * 2}" fill="#2A0C3A" opacity=".75"/>`).join('')}
<path d="M0 520 L0 380 L70 380 L70 300 L120 300 L120 360 L170 360 L170 250 L230 250 L230 340 L290 340 L290 400 L790 400 L790 320 L840 320 L840 230 L900 230 L900 330 L950 330 L950 280 L1010 280 L1010 360 L1080 360 L1080 520 Z" fill="#14061F"/>
<g stroke="#14061F" stroke-width="10" fill="none" stroke-linecap="round"><path d="M110 520 Q120 400 150 300"/><path d="M960 520 Q950 410 925 310"/></g>
<g fill="#14061F"><path d="M150 300 q-70 -10 -110 30 q60 -20 110 -24 z"/><path d="M150 300 q60 -40 120 -10 q-60 0 -118 14 z"/><path d="M150 300 q-20 -60 -80 -80 q50 40 76 82 z"/><path d="M150 300 q30 -60 90 -60 q-60 20 -86 62 z"/>
<path d="M925 310 q70 -10 110 30 q-60 -20 -110 -24 z"/><path d="M925 310 q-60 -40 -120 -10 q60 0 118 14 z"/><path d="M925 310 q20 -60 80 -80 q-50 40 -76 82 z"/><path d="M925 310 q-30 -60 -90 -60 q60 20 86 62 z"/></g>
<rect x="0" y="470" width="1080" height="50" fill="#0D0416"/></svg>`;

const foot = `<div style="position:absolute;left:0;right:0;bottom:70px;text-align:center;font:700 30px Pop;letter-spacing:6px;color:#fff;opacity:.9">@PSYCHOLOGSPORTU</div>`;
const wrap = inner => `<!doctype html><html><head><meta charset="utf-8"><style>${font}
*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1920px;overflow:hidden;background:${bg};font-family:Pop;color:#fff;position:relative}
.hl{color:${ORANGE}}.pk{color:${PINK}}
.box{position:absolute;left:80px;right:80px}
.tag{display:inline-block;font:800 30px Pop;letter-spacing:5px;padding:14px 30px;border-radius:999px;background:${PINK};color:#fff}
.h{font:400 118px/1.04 Ant;text-transform:uppercase;letter-spacing:1px;text-shadow:0 6px 0 rgba(0,0,0,.25)}
.p{font:600 44px/1.42 Pop}
.card{background:rgba(20,6,31,.72);border:3px solid ${TEAL};border-radius:28px;padding:44px 48px}
</style></head><body>${inner}${foot}</body></html>`;

// HUD: pasek misji, gwiazdki, minimapa (własne rysunki)
const stars = n => `<div style="display:flex;gap:14px">${[0, 1, 2, 3, 4].map(i => `<svg width="54" height="54" viewBox="0 0 24 24"><path d="M12 2l3 6.5 7 .8-5.2 4.8 1.4 7L12 17.6 5.8 21.1l1.4-7L2 9.3l7-.8z" fill="${i < n ? ORANGE : 'none'}" stroke="${ORANGE}" stroke-width="1.6"/></svg>`).join('')}</div>`;
const bar = (label, pct, col) => `<div style="margin-top:22px"><div style="font:700 28px Pop;letter-spacing:3px;opacity:.9">${label}</div><div style="margin-top:10px;height:26px;border-radius:13px;background:rgba(255,255,255,.18);overflow:hidden"><div style="width:${pct}%;height:100%;background:${col}"></div></div></div>`;
const minimap = `<svg width="300" height="300" viewBox="0 0 300 300"><circle cx="150" cy="150" r="140" fill="rgba(20,6,31,.8)" stroke="${TEAL}" stroke-width="6"/>
<g stroke="rgba(255,255,255,.25)" stroke-width="8"><line x1="20" y1="110" x2="280" y2="110"/><line x1="40" y1="200" x2="270" y2="200"/><line x1="110" y1="15" x2="110" y2="285"/><line x1="200" y1="20" x2="200" y2="280"/></g>
<path d="M150 200 L150 110 L200 110 L200 60" stroke="${PINK}" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="200" cy="56" r="20" fill="${ORANGE}"/><polygon points="150,180 136,214 150,206 164,214" fill="#fff"/></svg>`;

const s1 = wrap(`
<div class="box" style="top:170px"><span class="tag">PREMIERA GTA 6</span></div>
<div class="box" style="top:300px"><div class="h">Dziś wieczorem<br>pół Polski<br>jedzie do <span class="hl">Vice City</span></div></div>
<div class="box" style="top:790px"><div class="p">Zanim odpalisz grę, jedno pytanie od psychologa sportu: co robisz, kiedy misja ci nie wyjdzie?</div></div>
${city}`);

const s2 = wrap(`
<div class="box" style="top:160px;display:flex;justify-content:space-between;align-items:flex-start">
  <div style="width:520px">${stars(4)}${bar('ZDROWIE', 34, PINK)}${bar('PANCERZ', 12, TEAL)}</div>${minimap}</div>
<div class="box card" style="top:560px">
  <div style="font:400 92px/1.05 Ant;text-transform:uppercase;color:${PINK}">Misja nieudana</div>
  <div class="p" style="margin-top:26px">I co robisz? Patrzysz, w którym miejscu poszło źle, poprawiasz jedną rzecz i <span class="hl">wchodzisz jeszcze raz</span>.</div>
  <div class="p" style="margin-top:26px">Nikt po przegranej misji nie mówi sobie, że jest beznadziejny i nie nadaje się do grania.</div>
</div>
<div class="box" style="top:1290px"><div style="font:400 96px/1.08 Ant;text-transform:uppercase">A po słabym meczu<br>albo starcie <span class="hl">też tak</span><br>do siebie podchodzisz?</div></div>`);

const s3 = wrap(`
<div class="box" style="top:170px"><span class="tag" style="background:${TEAL};color:#14061F">TWOJA MISJA</span></div>
<div class="box" style="top:300px"><div class="h" style="font-size:104px">W sporcie też<br>masz <span class="hl">mapę</span>,<br>cel i kolejną<br><span class="pk">próbę</span></div></div>
<div class="box" style="top:930px"><div class="p">Na sesji ustawiamy jedną misję naraz, sprawdzamy, co zadziałało, a co poprawić, i uczymy się wracać do gry po błędzie, bez gadania sobie, że jesteś do niczego.</div></div>
<div class="box" style="top:1330px;background:${ORANGE};color:#14061F;border-radius:26px;padding:34px 40px;text-align:center">
  <div style="font:800 46px/1.25 Pop">Umów się na bezpłatną sesję zero</div>
  <div style="font:700 34px Pop;margin-top:10px">link w bio · andrzejstaszczuk.pl</div></div>`);

(async () => {
  const out = process.argv[2];
  for (const [n, h] of [[1, s1], [2, s2], [3, s3]]) { await render(h, path.join(out, n + '.png'), 1080, 1920); console.log('ok', n); }
})();
