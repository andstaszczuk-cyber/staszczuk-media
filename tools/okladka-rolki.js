// Okładka rolki 9:16 (1080x1920) dla @psychologsportu, układ 3: rama z numerem.
// Użycie:
//   node okladka-rolki.js '<json>' ../psychologsportu/okladki/013-slug.png
// json:
//   {"typ":"czat","num":13,"a":"tekst zawodnika","r":"odpowiedź Andrzeja"}
//   {"typ":"ludzik","num":13,"fig":1,"t1":"Myśli kręcą się ","hl":"w kółko","t2":""}   fig: 1 kółko, 2 ciężar, 3 rozdroże
//   {"typ":"twarz","num":13,"tag":"PODCAST","foto":"/sciezka/kadr.jpg","t1":"Jak zbudować ","hl":"pewność siebie","t2":"?"}
//   tag dla twarzy: PODCAST, W MEDIACH albo MÓWIĘ. Bez pola foto powstaje sylweta zastępcza.
// Tytuły: bez cudzysłowów, bez przeczeń typu nie X tylko Y, jedno żółte słowo albo fraza (hl).
const fs = require('fs');
const path = require('path');
const F = p => 'file://' + path.join(__dirname, 'node_modules/@fontsource', p);

const Y = '#F4B63A', RED1 = '#C42332', RED2 = '#8E1426', INK = '#11141A';
const DARK = 'radial-gradient(120% 60% at 50% 0%, #1E242E 0%, #11141A 70%)';
const RED = `linear-gradient(180deg, ${RED1} 0%, ${RED2} 100%)`;
const FACE_DARK = 'radial-gradient(110% 70% at 50% 38%, #3A4352 0%, #151A22 75%)';
const OV = 'linear-gradient(180deg, rgba(10,12,16,0) 0%, rgba(10,12,16,0.94) 62%)';

const esc = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;');

const fontCss = ['400', '600', '700', '800'].map(w => `
@font-face{font-family:Pop;font-weight:${w};src:url(${F(`poppins/files/poppins-latin-ext-${w}-normal.woff2`)}) format('woff2');unicode-range:U+0100-024F,U+1E00-1EFF}
@font-face{font-family:Pop;font-weight:${w};src:url(${F(`poppins/files/poppins-latin-${w}-normal.woff2`)}) format('woff2')}`).join('\n');

const FIG = {
  1: `<ellipse cx="100" cy="64" rx="52" ry="36" stroke="${Y}" stroke-dasharray="7 8"/><polygon points="146,46 158,60 140,62" fill="${Y}" stroke="${Y}"/>
      <circle cx="100" cy="64" r="14"/><line x1="100" y1="78" x2="100" y2="122"/><line x1="100" y1="92" x2="80" y2="110"/><line x1="100" y1="92" x2="120" y2="110"/><line x1="100" y1="122" x2="88" y2="160"/><line x1="100" y1="122" x2="112" y2="160"/>`,
  2: `<rect x="64" y="22" width="72" height="40" rx="3" stroke="${Y}"/><line x1="64" y1="42" x2="136" y2="42" stroke="${Y}"/>
      <circle cx="100" cy="86" r="14"/><line x1="100" y1="100" x2="100" y2="128"/><line x1="100" y1="106" x2="72" y2="62"/><line x1="100" y1="106" x2="128" y2="62"/><line x1="100" y1="128" x2="88" y2="160"/><line x1="100" y1="128" x2="112" y2="160"/>`,
  3: `<path d="M100 76 L100 54 L52 20" stroke="${Y}"/><polygon points="44,14 62,20 52,32" fill="${Y}" stroke="${Y}"/><path d="M100 54 L148 20" stroke="${Y}"/><polygon points="156,14 148,32 138,20" fill="${Y}" stroke="${Y}"/>
      <circle cx="100" cy="98" r="14"/><line x1="100" y1="112" x2="100" y2="136"/><line x1="100" y1="120" x2="82" y2="134"/><line x1="100" y1="120" x2="118" y2="134"/><line x1="100" y1="136" x2="90" y2="160"/><line x1="100" y1="136" x2="110" y2="160"/>`,
};

function title(o) {
  return `<div style="margin-top:22px;color:#fff;font-size:25px;font-weight:800;line-height:1.14;white-space:pre-wrap"><span>${esc(o.t1)}</span><span style="color:${Y}">${esc(o.hl)}</span><span>${esc(o.t2)}</span></div>`;
}

function body(o) {
  let bg = DARK, tag = 'ROZMOWA', inner = '', under = '';
  if (o.typ === 'czat') {
    inner = `<div style="margin-top:34px;display:flex;flex-direction:column;gap:10px">
      <div style="color:#A9B0BC;font-size:10px;font-weight:600">zawodnik</div>
      <div style="align-self:flex-start;max-width:190px;background:#2A303B;color:#fff;font-size:15px;font-weight:700;line-height:1.3;padding:12px 14px;border-radius:18px 18px 18px 4px">${esc(o.a)}</div>
      <div style="align-self:flex-end;color:#A9B0BC;font-size:10px;font-weight:600;margin-top:8px">Andrzej</div>
      <div style="align-self:flex-end;max-width:190px;background:${RED1};color:#fff;font-size:13px;font-weight:600;line-height:1.35;padding:11px 14px;border-radius:18px 18px 4px 18px">${esc(o.r)}</div></div>`;
  } else if (o.typ === 'ludzik') {
    bg = RED; tag = 'JAK TO DZIAŁA';
    inner = title(o) + `<div style="margin-top:24px;display:flex;justify-content:center"><svg viewBox="0 0 200 170" width="196" height="166" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="14" y1="160" x2="186" y2="160" stroke-opacity="0.35"/>${FIG[o.fig || 1]}</svg></div>`;
  } else {
    tag = o.tag || 'PODCAST';
    const photo = o.foto
      ? `<img src="file://${o.foto}" style="position:absolute;left:0;top:0;width:240px;height:427px;object-fit:cover">`
      : `<svg viewBox="0 0 240 428" width="240" height="428" style="position:absolute;left:0;top:0"><circle cx="120" cy="168" r="52" fill="rgba(255,255,255,0.10)"/><path d="M20 428 C20 316 66 262 120 262 C174 262 220 316 220 428 Z" fill="rgba(255,255,255,0.10)"/></svg>`;
    bg = FACE_DARK;
    under = photo + `<div style="position:absolute;left:0;right:0;bottom:0;height:250px;background:${OV}"></div>`;
    inner = `<div style="flex-grow:1"></div>` + title(o).replace('margin-top:22px;', '');
  }
  return `<div style="position:relative;width:240px;height:427px;overflow:hidden;background:${bg};font-family:Pop,sans-serif">
    ${under}
    <div style="position:absolute;left:9px;top:9px;right:9px;bottom:9px;border:2px solid rgba(244,182,58,0.85);border-radius:8px"></div>
    <div style="position:absolute;left:0;top:0;width:240px;height:427px;box-sizing:border-box;padding:70px 22px 62px 22px;display:flex;flex-direction:column">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div style="background:${Y};color:${INK};font-size:10px;font-weight:800;letter-spacing:.08em;padding:5px 10px;border-radius:20px">${esc(tag)}</div>
        <div style="color:${Y};font-size:18px;font-weight:800">${esc(o.num)}</div>
      </div>${inner}</div></div>`;
}

async function main() {
  const o = JSON.parse(process.argv[2]);
  const out = process.argv[3];
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>${fontCss}html,body{margin:0;background:#000;width:270px;height:480px;overflow:hidden}</style></head><body><div style="transform:scale(1.125);transform-origin:0 0;width:240px;height:427px">${body(o)}</div></body></html>`;
  const tmp = path.join(__dirname, '.okladka.tmp.html');
  fs.writeFileSync(tmp, html);
  const { chromium } = require('playwright');
  let exe;
  try {
    const cands = [];
    for (const d of fs.readdirSync('/opt/pw-browsers').sort().reverse()) {
      cands.push(`/opt/pw-browsers/${d}/chrome-linux64/chrome`, `/opt/pw-browsers/${d}/chrome-linux/headless_shell`, `/opt/pw-browsers/${d}/chrome-linux/chrome`);
    }
    exe = cands.find(c => fs.existsSync(c));
  } catch (e) {}
  const b = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 270, height: 480 }, deviceScaleFactor: 4 });
  await p.goto('file://' + tmp);
  await p.evaluate(() => document.fonts.ready);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await p.screenshot({ path: out });
  await b.close();
  fs.unlinkSync(tmp);
  console.log('ok', out);
}
main();
