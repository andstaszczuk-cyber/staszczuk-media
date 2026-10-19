// Sportowa Rodzina – styl profilu (akwarelowe ilustracje, odręczna czcionka, jasne tła)
// node family.js spec.json outDir
// spec: {"bg":"cream|khaki|white","slides":[{"kind":"cover","text":"...","image":"/abs/path.png (opcjonalnie)"},{"kind":"point","title":"...","body":"..."},{"kind":"end","text":"...","cta":"..."}]}
const fs = require('fs'), path = require('path');
const [, , specPath, outDir] = process.argv;
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
const BG = { cream: '#F4F1E6', khaki: '#C4C18E', white: '#FFFFFF' }[spec.bg || 'cream'];
const INK = spec.bg === 'white' ? '#7A2423' : '#2A2622';
const ACC = spec.bg === 'khaki' ? '#7A2423' : '#AE4549';
const F = p => 'file://' + path.join(__dirname, 'node_modules/@fontsource', p);
const css = `@font-face{font-family:AD;src:url(${F('architects-daughter/files/architects-daughter-latin-ext-400-normal.woff2')});unicode-range:U+0100-024F,U+1E00-1EFF}
@font-face{font-family:AD;src:url(${F('architects-daughter/files/architects-daughter-latin-400-normal.woff2')})}
html,body{margin:0;width:1080px;height:1350px;overflow:hidden;background:${BG};color:${INK};font-family:AD,sans-serif}
.a{color:${ACC}} .c{position:absolute;left:70px;right:70px;text-align:center}`;
const hl = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').split('\n').map(l => l.replace(/\*(.+?)\*/g, '<span class="a">$1</span>')).join('<br>');
const len = s => String(s).replace(/\*/g, '').length;
const total = spec.slides.length;
const foot = i => `<div class="c" style="bottom:46px;font-size:26px;opacity:.7">@sportowarodzina${total > 1 ? ' · ' + (i + 1) + '/' + total : ''}</div>`;
function slide(s, i) {
  if (s.kind === 'cover') {
    if (s.image) {
      const img = 'data:image/png;base64,' + fs.readFileSync(s.image).toString('base64');
      return `<div class="c" style="top:80px;font-size:${len(s.text) < 45 ? 70 : 60}px;line-height:1.25">${hl(s.text)}</div>
        <img src="${img}" style="position:absolute;left:90px;right:90px;top:${len(s.text) < 45 ? 330 : 380}px;bottom:110px;width:900px;height:calc(100% - ${len(s.text) < 45 ? 440 : 490}px);object-fit:contain;mix-blend-mode:multiply">
        ${total > 1 ? `<div style="position:absolute;right:70px;bottom:44px;font-size:30px" class="a">przesuń →</div>` : ''}${foot(i)}`;
    }
    return `<div class="c" style="top:0;bottom:0;display:flex;align-items:center;justify-content:center;flex-direction:column">
      <div style="font-size:${len(s.text) < 45 ? 100 : 86}px;line-height:1.25">${hl(s.text)}</div>
      <svg width="260" height="30" style="margin-top:40px"><path d="M5,18 C60,4 120,28 180,12 S240,10 255,16" fill="none" stroke="${ACC}" stroke-width="6" stroke-linecap="round"/></svg></div>
      ${total > 1 ? `<div style="position:absolute;right:70px;bottom:44px;font-size:30px" class="a">przesuń →</div>` : ''}${foot(i)}`;
  }
  if (s.kind === 'point') {
    const n = spec.slides.slice(0, i + 1).filter(x => x.kind === 'point').length;
    return `<div style="position:absolute;left:90px;right:90px;top:150px">
      <div class="a" style="font-size:120px;line-height:1">${n}.</div>
      <div style="font-size:74px;line-height:1.2;margin:30px 0 44px">${hl(s.title)}</div>
      <div style="font-size:${len(s.body) < 160 ? 54 : 48}px;line-height:1.45">${hl(s.body)}</div></div>${foot(i)}`;
  }
  return `<div class="c" style="top:0;bottom:0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:40px">
    <div style="font-size:${len(s.text) < 60 ? 78 : 64}px;line-height:1.25">${hl(s.text)}</div>
    <svg width="200" height="26"><path d="M5,15 C50,4 100,24 150,10 S190,10 195,14" fill="none" stroke="${ACC}" stroke-width="6" stroke-linecap="round"/></svg>
    <div style="font-size:48px;line-height:1.45;opacity:.9">${hl(s.cta || 'Zapisz na później i wyślij innemu rodzicowi.')}</div></div>${foot(i)}`;
}
(async () => {
  const { chromium } = require('playwright');
  const d = fs.readdirSync('/opt/pw-browsers').filter(x => x.startsWith('chromium_headless_shell')).sort().reverse()[0];
  const b = await chromium.launch({ executablePath: d ? `/opt/pw-browsers/${d}/chrome-linux/headless_shell` : undefined, args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  fs.mkdirSync(outDir, { recursive: true });
  const tmp = path.join(__dirname, `.tmp-${process.pid}.html`);
  for (let i = 0; i < total; i++) {
    fs.writeFileSync(tmp, `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${slide(spec.slides[i], i)}</body></html>`);
    await p.goto('file://' + tmp); await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(outDir, `${i + 1}.png`) });
  }
  fs.unlinkSync(tmp); await b.close();
})();
