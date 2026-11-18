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
const wrap = (inner, rightFoot) => `<!doctype html><html><head><meta charset="utf-8"><style>${font}
*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1920px;overflow:hidden;background:${bg};font-family:Pop;color:#fff;position:relative}
.hl{color:${ORANGE}}.pk{color:${PINK}}
.box{position:absolute;left:80px;right:80px}
.tag{display:inline-block;font:800 30px Pop;letter-spacing:5px;padding:14px 30px;border-radius:999px;background:${PINK};color:#fff}
.h{font:400 118px/1.04 Ant;text-transform:uppercase;letter-spacing:1px;text-shadow:0 6px 0 rgba(0,0,0,.25)}
.p{font:600 44px/1.42 Pop}
.card{background:rgba(20,6,31,.72);border:3px solid ${TEAL};border-radius:28px;padding:44px 48px}
</style></head><body>${inner}${rightFoot ? foot.replace('left:0;right:0;bottom:70px;text-align:center','right:60px;bottom:70px;text-align:right') : foot}</body></html>`;

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

const scene = `<svg viewBox="0 0 1080 1920" width="1080" height="1920" style="position:absolute;left:0;top:0">
<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2B1055"/><stop offset=".45" stop-color="#C2376E"/><stop offset=".62" stop-color="#FF8A5B"/><stop offset=".7" stop-color="#FFC56E"/></linearGradient>
<linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5B2A7A"/><stop offset="1" stop-color="#140A2A"/></linearGradient>
<radialGradient id="vig" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".7"/></radialGradient></defs>
<rect width="1080" height="1600" fill="url(#sky)"/><g transform="translate(0,260)"><circle cx="700" cy="1250" r="190" fill="#FFE08A" opacity=".9"/>
<rect y="1300" width="1080" height="620" fill="url(#sea)"/>
${[0,1,2,3,4,5,6].map(i=>`<rect x="${560-i*10}" y="${1320+i*34}" width="${280+i*20}" height="6" fill="#FFC56E" opacity="${.55-i*.06}"/>`).join('')}
<path d="M0 1310 L0 1130 L60 1130 L60 1010 L120 1010 L120 1090 L180 1090 L180 930 L250 930 L250 1060 L320 1060 L320 1180 L400 1180 L400 1240 L470 1240 L470 1310 Z" fill="#1A0A2E"/>
<g fill="#FF3D8B" opacity=".9">${[0,1,2,3,4,5].map(i=>`<rect x="${200+(i%2)*24}" y="${960+i*40}" width="12" height="18"/>`).join('')}${[0,1,2].map(i=>`<rect x="${80+i*18}" y="${1040+i*30}" width="10" height="14"/>`).join('')}</g>
<g stroke="#120622" stroke-width="16" fill="none" stroke-linecap="round"><path d="M930 1920 Q940 1500 880 1120"/><path d="M1040 1920 Q1030 1600 1060 1300"/></g>
<g fill="#120622"><path d="M880 1120 q-150 -20 -230 70 q120 -50 230 -56 z"/><path d="M880 1120 q130 -90 250 -20 q-130 -10 -248 36 z"/><path d="M880 1120 q-40 -130 -170 -170 q110 80 166 176 z"/><path d="M880 1120 q70 -130 190 -130 q-120 40 -186 136 z"/><path d="M880 1120 q-120 30 -190 160 q90 -100 192 -150 z"/>
<path d="M1060 1300 q-120 -30 -200 40 q100 -30 200 -30 z"/><path d="M1060 1300 q-40 -100 -150 -130 q90 60 148 140 z"/></g>
</g><rect width="1080" height="1920" fill="url(#vig)"/></svg>`;
const s2 = wrap(`${scene}
<div style="position:absolute;left:60px;top:90px;width:560px;background:rgba(0,0,0,.72);border-radius:10px;padding:26px 30px;font:600 34px/1.35 Pop">Cel: <span style="color:${TEAL}">wróć do gry po błędzie</span>.</div>
<div style="position:absolute;right:60px;top:96px;text-align:right">${stars(2)}</div>
<div style="position:absolute;left:0;right:0;top:330px;background:linear-gradient(90deg,rgba(0,0,0,0),rgba(0,0,0,.82) 15%,rgba(0,0,0,.82) 85%,rgba(0,0,0,0));padding:40px 0 46px;text-align:center">
  <div style="font:400 150px/1 Ant;text-transform:uppercase;color:${PINK};transform:skewX(-8deg);text-shadow:5px 5px 0 #000,0 0 30px rgba(255,61,139,.55)">Misja nieudana</div>
  <div class="p" style="margin:26px auto 0;width:860px;font-size:40px">Patrzysz, w którym miejscu poszło źle, poprawiasz jedną rzecz i <span class="hl">wchodzisz jeszcze raz</span>.</div>
  <div style="margin-top:34px;display:flex;justify-content:center;gap:24px;font:800 36px Pop;letter-spacing:2px">
    <span style="background:#fff;color:#14061F;padding:12px 34px;border-radius:8px">▶ SPRÓBUJ PONOWNIE</span><span style="padding:12px 34px;opacity:.6">WYJDŹ</span></div>
</div>
<div class="box" style="top:880px;background:rgba(0,0,0,.6);border-radius:10px;padding:26px 32px"><div class="p" style="font-size:40px">Nikt po przegranej misji nie mówi sobie, że jest beznadziejny i nie nadaje się do grania.</div></div>
<img src="file://${path.join(__dirname,'../psychologsportu/relacje/2026-11-19-gta6/andrzej-wyciety.png')}" style="position:absolute;right:10px;bottom:0;height:820px;filter:saturate(1.15) contrast(1.05) drop-shadow(0 0 0 #fff) drop-shadow(6px 0 0 #14061F) drop-shadow(-6px 0 0 #14061F) drop-shadow(0 -6px 0 #14061F) drop-shadow(0 0 40px rgba(255,61,139,.6))">
<div style="position:absolute;left:60px;top:1140px;width:540px;background:rgba(0,0,0,.62);border-radius:10px;padding:24px 30px 24px 44px"><div style="font:400 62px/1.08 Ant;text-transform:uppercase;transform:skewX(-6deg);text-shadow:4px 4px 0 #000">A po słabym<br>meczu albo<br>starcie <span class="pk">też tak</span><br>do siebie<br>podchodzisz?</div></div>
<div style="position:absolute;left:60px;bottom:60px;width:240px">${minimap.replace('width="300" height="300"','width="240" height="240"')}${bar('', 34, PINK).replace('margin-top:22px','margin-top:6px')}${bar('', 12, TEAL).replace('margin-top:22px','margin-top:-14px')}</div>`);

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
