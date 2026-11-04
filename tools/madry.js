// Mądry Sport – karuzele IG 1080x1350 (kolory i czcionka Mulish jak na madrysport.pl)
// node madry.js spec.json outDir
// spec: {"theme":"cieply|czerwony|grafit","filar":"głowa|ciało|głowa i ciało",
//   "cover":{"title":"...*wyróżnienie*...","sub":"...","art":{"type":"<VIZ z psy2>", ...}},
//   "points":[{"title":"...","body":"...","art":{...} (opcjonalnie)}],
//   "end":{"text":"...","cta":"Zapisz i ..."}}
const fs = require('fs'), path = require('path');
const { VIZ } = require('./psy2');
const F = p => 'file://' + path.join(__dirname, 'node_modules/@fontsource', p);
// kolory z madrysport.pl (4.11.2026, turkus jak na landingu Zdrowie psychiczne w sporcie): petrol #0D262C, turkus #15625F, jasny turkus #E6F2F1, mięta #BCD6D2, róż #F6CFD2, słońce #F2C14E
// nazwy motywów zostają (cieply = jasnozielony, czerwony = ciemnozielony, grafit = różowy), żeby stare spec.json dalej działały
const DG = '#0D262C', GR = '#15625F', LG = '#E6F2F1', PK = '#F6CFD2', SUN = '#F2C14E';
const TH = {
  cieply: { bg: LG, fg: DG, A: GR, onA: '#fff', mute: 'rgba(13,38,44,.72)', soft: 'rgba(13,38,44,.22)', faint: 'rgba(13,38,44,.07)', line: 'rgba(13,38,44,.16)',
    card: 'rgba(255,255,255,.75)', cardS: '#fff', fig: DG, fig2: 'rgba(13,38,44,.35)', paper: '#fff', paperInk: DG, y: GR, chip: GR, chipInk: '#fff', btn: GR, btnInk: '#fff', num: GR },
  czerwony: { bg: DG, fg: '#fff', A: SUN, onA: DG, mute: 'rgba(255,255,255,.78)', soft: 'rgba(255,255,255,.26)', faint: 'rgba(255,255,255,.08)', line: 'rgba(255,255,255,.18)',
    card: 'rgba(255,255,255,.08)', cardS: 'rgba(255,255,255,.16)', fig: '#fff', fig2: 'rgba(255,255,255,.45)', paper: '#fff', paperInk: DG, y: PK, chip: PK, chipInk: DG, btn: PK, btnInk: DG, num: PK },
  grafit: { bg: PK, fg: DG, A: GR, onA: '#fff', mute: 'rgba(13,38,44,.74)', soft: 'rgba(13,38,44,.24)', faint: 'rgba(13,38,44,.08)', line: 'rgba(13,38,44,.18)',
    card: 'rgba(255,255,255,.55)', cardS: 'rgba(255,255,255,.85)', fig: DG, fig2: 'rgba(13,38,44,.35)', paper: '#fff', paperInk: DG, y: GR, chip: GR, chipInk: '#fff', btn: DG, btnInk: '#fff', num: GR },
};
const esc = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/[„“”"]/g, '');
const rich = s => esc(s).replace(/\*(.+?)\*/g, '<span class="hl">$1</span>').replace(/\n/g, '<br>');
const len = s => String(s || '').replace(/\*/g, '').length;
const art = (t, a) => a && (VIZ[a.type] ? VIZ[a.type](t, a).replace(/#FCE86A/gi, t.y) : '');
const PAD = 90;

function chrome(t, spec, i, total) {
  const fil = esc((spec.filar || 'głowa i ciało').toUpperCase());
  return `<div style="position:absolute;left:${PAD}px;top:70px;display:flex;align-items:center;gap:14px">
      <div style="width:22px;height:22px;border-radius:50%;background:${t.chip}"></div>
      <div style="font-weight:800;font-size:26px;letter-spacing:5px;color:${t.fg}">${fil}</div></div>
    <div style="position:absolute;left:${PAD}px;right:${PAD}px;bottom:60px;display:flex;align-items:flex-end;justify-content:space-between;color:${t.fg}">
      <div style="font-weight:800;font-size:26px;letter-spacing:4px;line-height:1.05">MĄDRY<br>SPORT</div>
      <div style="font-weight:600;font-size:22px;opacity:.8">@madrysport.pl · ${i}/${total}</div></div>
    ${i < total ? `<div style="position:absolute;right:${PAD}px;top:70px;font-weight:600;font-size:24px;color:${t.num}">przesuń →</div>` : ''}`;
}
function cover(t, c) {
  const n = len(c.title), fs_ = c.size || (n <= 30 ? 112 : n <= 50 ? 96 : 82);
  return `<div class="box" style="top:170px"><div class="h" style="font-size:${fs_}px;color:${t.fg}">${rich(c.title)}</div>
    ${c.sub ? `<div style="margin-top:32px;font-weight:600;font-size:42px;line-height:1.4;color:${t.mute}">${rich(c.sub)}</div>` : ''}</div>
    ${c.art ? `<svg class="art" viewBox="0 0 900 620" style="top:${c.artTop || 640}px;height:${c.artH || 520}px">${art(t, c.art)}</svg>` : ''}`;
}
function point(t, p, k) {
  const top = p.art ? 'top:180px' : 'top:0;bottom:0;justify-content:center';
  return `<div class="box" style="${top}">
    <div style="font-weight:800;font-size:140px;line-height:1;color:${t.num}">${String(k).padStart(2, '0')}</div>
    <div style="width:120px;height:8px;background:${t.num};border-radius:4px;margin:26px 0 34px"></div>
    <div class="h" style="font-size:${len(p.title) <= 34 ? 80 : 68}px;color:${t.fg}">${rich(p.title)}</div>
    <div style="margin-top:30px;font-weight:600;font-size:${len(p.body) <= 180 ? 44 : 38}px;line-height:1.45;color:${t.mute}">${rich(p.body)}</div></div>
    ${p.art ? `<svg class="art" viewBox="0 0 900 620" style="top:${p.artTop || 860}px;height:${p.artH || 360}px">${art(t, p.art)}</svg>` : ''}`;
}
function end(t, e) {
  return `<div class="box" style="top:0;bottom:0;justify-content:center">
    <div class="h" style="font-size:${len(e.text) <= 60 ? 92 : 76}px;color:${t.fg}">${rich(e.text)}</div>
    ${e.cta ? `<div style="margin-top:50px;display:inline-block;background:${t.btn};color:${t.btnInk};border-radius:999px;font-weight:800;font-size:36px;padding:24px 44px">${esc(e.cta)}</div>` : ''}</div>`;
}
function doc(t, inner) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face{font-family:M;font-weight:600;src:url(${F('mulish/files/mulish-latin-ext-600-normal.woff2')});unicode-range:U+0100-024F}
  @font-face{font-family:M;font-weight:600;src:url(${F('mulish/files/mulish-latin-600-normal.woff2')})}
  @font-face{font-family:M;font-weight:800;src:url(${F('mulish/files/mulish-latin-ext-800-normal.woff2')});unicode-range:U+0100-024F}
  @font-face{font-family:M;font-weight:800;src:url(${F('mulish/files/mulish-latin-800-normal.woff2')})}
  @font-face{font-family:P;font-weight:600;src:url(${F('mulish/files/mulish-latin-ext-600-normal.woff2')});unicode-range:U+0100-024F}
  @font-face{font-family:P;font-weight:600;src:url(${F('mulish/files/mulish-latin-600-normal.woff2')})}
  @font-face{font-family:P;font-weight:800;src:url(${F('mulish/files/mulish-latin-ext-800-normal.woff2')});unicode-range:U+0100-024F}
  @font-face{font-family:P;font-weight:800;src:url(${F('mulish/files/mulish-latin-800-normal.woff2')})}
  html,body{margin:0;width:1080px;height:1350px;overflow:hidden;position:relative;font-family:M}
  body{background:${t.bg}} svg text{font-family:M}
  .art{position:absolute;left:${PAD}px;width:${1080 - 2 * PAD}px;overflow:visible}
  .box{position:absolute;left:${PAD}px;right:${PAD}px;display:flex;flex-direction:column;align-items:flex-start}
  .h{font-weight:800;line-height:1.1;letter-spacing:-1px;text-wrap:balance}
  .hl{color:${t.y}}
  </style></head><body>${inner}</body></html>`;
}
async function main() {
  const [, , specPath, outDir] = process.argv;
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  const t = TH[spec.theme || 'cieply'];
  const total = 2 + spec.points.length;
  fs.mkdirSync(outDir, { recursive: true });
  const pages = [cover(t, spec.cover), ...spec.points.map((p, i) => point(t, p, i + 1)), end(t, spec.end)]
    .map((inner, i) => inner + chrome(t, spec, i + 1, total));
  const { chromium } = require('playwright');
  const g = fs.readdirSync('/opt/pw-browsers').filter(d => d.startsWith('chromium_headless_shell')).sort().reverse();
  const b = await chromium.launch({ executablePath: `/opt/pw-browsers/${g[0]}/chrome-linux/headless_shell`, args: ['--no-sandbox'] });
  const pg = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  const tmp = path.join(__dirname, `.tmpm-${process.pid}.html`);
  for (const [i, inner] of pages.entries()) {
    fs.writeFileSync(tmp, doc(t, inner));
    await pg.goto('file://' + tmp);
    await pg.evaluate(() => document.fonts.ready);
    await pg.screenshot({ path: path.join(outDir, `${i + 1}.png`) });
  }
  fs.unlinkSync(tmp);
  await b.close();
}
main();
