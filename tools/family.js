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
const R = (d, w = 7, c) => `<path d="${d}" fill="none" stroke="${c || INK}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const ICONS = {
  hug: () => `<circle cx="120" cy="70" r="30" fill="none" stroke="${INK}" stroke-width="7"/>` + R('M120,100 C85,105 80,150 85,200 L90,270') + R('M120,100 C150,105 160,140 158,175') + R('M150,270 L152,215') +
    `<circle cx="195" cy="130" r="24" fill="none" stroke="${ACC}" stroke-width="7"/>` + R('M195,154 C175,160 172,200 175,230 L178,270', 7, ACC) + R('M195,154 C215,160 222,195 220,230 L218,270', 7, ACC) +
    R('M88,140 C120,175 170,185 215,165', 7) + R('M215,190 C190,182 172,170 160,150', 6, ACC),
  growth: () => R('M150,30 L150,275', 7) + [250, 205, 160, 115, 72].map((y, k) => R(`M150,${y} L${k === 4 ? 225 : 190},${y}`, k === 4 ? 8 : 5, k === 4 ? ACC : INK)).join('') +
    `<text x="200" y="208" font-family="AD" font-size="26" fill="${INK}">wrzesień</text><text x="235" y="80" font-family="AD" font-size="32" fill="${ACC}">dziś</text>` +
    `<circle cx="95" cy="95" r="22" fill="none" stroke="${INK}" stroke-width="6"/>` + R('M95,117 L95,200 M95,140 L70,175 M95,140 L125,120 M95,200 L78,270 M95,200 L112,270', 6),
  heart: () => R('M150,250 C60,190 30,120 80,85 C120,58 150,95 150,110 C150,95 180,58 220,85 C270,120 240,190 150,250 Z', 8, ACC) + R('M95,110 C100,98 110,92 120,92', 5, ACC),
  ball: () => R('M150,60 C210,62 245,110 243,155 C240,210 195,248 148,246 C95,244 57,200 58,152 C60,100 100,60 150,60 Z') + R('M150,110 L185,135 L172,178 L128,178 L115,135 Z', 6) + R('M150,110 L150,62 M185,135 L238,128 M172,178 L200,232 M128,178 L100,232 M115,135 L62,128', 5),
  moon: () => R('M190,70 C130,80 100,140 120,195 C140,245 205,255 245,220 C190,225 150,180 160,130 C165,100 175,82 190,70 Z', 8, ACC) + `<text x="200" y="110" font-family="AD" font-size="54" fill="${INK}">z</text><text x="235" y="80" font-family="AD" font-size="40" fill="${INK}">z</text><text x="262" y="56" font-family="AD" font-size="30" fill="${INK}">z</text>`,
  triangle: () => R('M150,60 L255,240 L45,240 Z', 5) + ['M150,60', 'M255,240', 'M45,240'].map((p, k) => `<circle cx="${[150, 255, 45][k]}" cy="${[60, 240, 240][k]}" r="${k === 0 ? 34 : 30}" fill="${BG}" stroke="${k === 0 ? ACC : INK}" stroke-width="7"/>`).join('') + `<text x="150" y="18" text-anchor="middle" font-family="AD" font-size="30" fill="${ACC}">dziecko</text><text x="255" y="296" text-anchor="middle" font-family="AD" font-size="28" fill="${INK}">trener</text><text x="45" y="296" text-anchor="middle" font-family="AD" font-size="28" fill="${INK}">rodzic</text>`,
};
const doodle = (name, size = 330) => `<svg viewBox="-20 -10 340 320" overflow="visible" width="${size}" height="${size}">${ICONS[name]()}</svg>`;
function slide(s, i) {
  const swipe = total > 1 ? `<div style="position:absolute;right:70px;bottom:44px;font-size:30px" class="a">przesuń →</div>` : '';
  if (s.kind === 'cover' && s.layout === 'doodle') {
    return `<div class="c" style="top:0;bottom:110px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:40px">
      <div style="font-size:${len(s.text) < 45 ? 84 : 72}px;line-height:1.25">${hl(s.text)}</div>${doodle(s.icon, 520)}</div>${swipe}${foot(i)}`;
  }
  if (s.kind === 'cover' && s.layout === 'bubble') {
    const b = s.bubbles.map((t, k) => `<div style="align-self:${k % 2 ? 'flex-end' : 'flex-start'};max-width:78%;border:6px solid ${k % 2 ? ACC : INK};border-radius:46px;padding:26px 44px;font-size:66px;line-height:1.2;background:${k % 2 ? 'transparent' : 'rgba(255,255,255,.35)'};transform:rotate(${k % 2 ? 1.5 : -1.5}deg)">${hl(t)}</div>`).join('');
    return `<div style="position:absolute;left:90px;right:90px;top:0;bottom:110px;display:flex;flex-direction:column;justify-content:center;gap:46px">${b}
      <div style="text-align:center;font-size:68px;line-height:1.25;margin-top:40px">${hl(s.text)}</div></div>${swipe}${foot(i)}`;
  }
  if (s.kind === 'cover' && s.layout === 'list') {
    const it = s.items.map((t, k) => `<div style="display:flex;gap:30px;align-items:center;margin:26px 0"><svg width="64" height="64" viewBox="0 0 64 64">${R('M8,10 L56,8 L58,56 L10,58 Z', 5)}${k < (s.checked || 0) ? R('M16,34 L28,46 L54,12', 7, ACC) : ''}</svg><span style="font-size:66px">${hl(t)}</span></div>`).join('');
    return `<div style="position:absolute;left:100px;right:90px;top:0;bottom:120px;display:flex;flex-direction:column;justify-content:center"><div style="font-size:80px;line-height:1.2;margin-bottom:50px">${hl(s.text)}</div>${it}</div>${swipe}${foot(i)}`;
  }
  if (s.kind === 'cover' && s.layout === 'versus') {
    return `<div class="c" style="top:0;bottom:0;display:flex;flex-direction:column;justify-content:center;gap:50px">
      <div style="font-size:70px;line-height:1.2;position:relative;opacity:.75;display:inline-block;align-self:center">${hl(s.old)}<svg style="position:absolute;left:-20px;top:30%;width:calc(100% + 40px);height:60px" viewBox="0 0 400 60" preserveAspectRatio="none">${R('M5,40 C100,20 220,45 395,15', 9, ACC)}</svg></div>
      <svg width="60" height="80" style="align-self:center" viewBox="0 0 60 80">${R('M30,5 L30,70 M10,50 L30,72 L50,50', 7)}</svg>
      <div style="font-size:82px;line-height:1.2">${hl(s.new)}</div>
      ${s.text ? `<div style="font-size:52px;line-height:1.3;opacity:.85">${hl(s.text)}</div>` : ''}</div>${swipe}${foot(i)}`;
  }
  if (s.kind === 'cover' && s.layout === 'marker') {
    const mk = String(s.text).replace(/&/g, '&amp;').split('\n').map(l => l.replace(/\*(.+?)\*/g, `<span style="background:linear-gradient(transparent 55%, ${spec.bg === 'khaki' ? '#F4F1E6' : '#FCE86A'} 55%, ${spec.bg === 'khaki' ? '#F4F1E6' : '#FCE86A'} 92%, transparent 92%);padding:0 6px">$1</span>`)).join('<br>');
    return `<div style="position:absolute;left:100px;right:100px;top:0;bottom:0;display:flex;align-items:center"><div style="font-size:${len(s.text) < 50 ? 96 : 82}px;line-height:1.35">${mk}</div></div>${swipe}${foot(i)}`;
  }
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
