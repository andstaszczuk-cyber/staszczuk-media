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
.a{color:${ACC}} em.q{font-style:italic;font-weight:600} .c{position:absolute;left:70px;right:70px;text-align:center}`;
const qq = s => String(s).replace(/[„“"]([^„”“"]+)[”"]/g, '_$1_').replace(/[„”“"]/g, '');
const em = s => s.replace(/_([^_]+)_/g, '<em class="q">$1</em>');
const hl = s => qq(s).replace(/\*([^*]+)\*/g, (m, x) => '*' + x.split('\n').join('*\n*') + '*').replace(/&/g, '&amp;').replace(/</g, '&lt;').split('\n').map(l => em(l.replace(/\*(.+?)\*/g, '<span class="a">$1</span>'))).join('<br>');
const len = s => qq(s).replace(/[*_]/g, '').length;
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
  wallet: () => R('M40,110 L250,105 L255,250 L45,255 Z') + R('M40,110 C60,80 90,70 120,72 L210,70 C225,72 235,85 240,106') + R('M255,150 L195,152 C180,153 175,165 176,178 C177,192 185,200 198,200 L255,198', 6) + `<circle cx="206" cy="176" r="8" fill="${ACC}"/>` +
    `<circle cx="95" cy="40" r="26" fill="none" stroke="${ACC}" stroke-width="6"/><circle cx="150" cy="28" r="22" fill="none" stroke="${ACC}" stroke-width="6"/>`,
  sprout: () => R('M150,270 L150,140', 7) + R('M150,190 C110,190 75,165 70,120 C115,118 148,145 150,190 Z', 7, ACC) + R('M150,150 C150,100 185,65 235,62 C238,110 200,148 150,150 Z', 7, ACC) +
    R('M70,270 C110,258 190,258 230,270', 7),
  compass: () => `<circle cx="150" cy="150" r="110" fill="none" stroke="${INK}" stroke-width="7"/>` + R('M150,60 L172,150 L150,240 L128,150 Z', 6) + `<path d="M150,60 L172,150 L128,150 Z" fill="${ACC}" stroke="${ACC}" stroke-width="6" stroke-linejoin="round"/>` +
    `<text x="150" y="28" text-anchor="middle" font-family="AD" font-size="34" fill="${ACC}">po co?</text>`,
  kompas: () => `<circle cx="150" cy="150" r="110" fill="none" stroke="${INK}" stroke-width="7"/>` + R('M150,60 L172,150 L150,240 L128,150 Z', 6) + `<path d="M150,60 L172,150 L128,150 Z" fill="${ACC}" stroke="${ACC}" stroke-width="6" stroke-linejoin="round"/>`,
  plaster: () => R('M60,190 L190,60 C210,40 240,40 258,58 C276,76 276,106 256,126 L126,256 C106,276 76,276 58,258 C40,240 40,210 60,190 Z') + R('M118,132 L168,182 M132,118 L182,168', 5) + [[140, 150], [155, 140], [150, 160], [165, 150]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${ACC}"/>`).join(''),
  phone: () => R('M95,30 L205,30 C218,30 225,38 225,50 L225,250 C225,262 218,270 205,270 L95,270 C82,270 75,262 75,250 L75,50 C75,38 82,30 95,30 Z') + R('M130,52 L170,52', 6) + `<circle cx="150" cy="245" r="9" fill="none" stroke="${INK}" stroke-width="5"/>` + R('M110,110 L190,180 M190,110 L110,180', 8, ACC),
  whistle: () => R('M60,120 L190,120 C230,120 255,150 255,185 C255,222 225,250 190,250 C155,250 128,225 125,195 L60,195 Z') + `<circle cx="190" cy="185" r="22" fill="${ACC}"/>` + R('M60,120 L60,195', 7) + R('M150,95 L150,60 M110,95 L95,65 M190,95 L205,65', 6, ACC),
  tent: () => R('M30,250 L150,50 L270,250 Z') + R('M150,50 L150,250', 5) + R('M150,250 L115,170 L150,150 L185,170 Z', 6, ACC) + R('M10,250 L290,250', 7) + `<circle cx="240" cy="70" r="20" fill="none" stroke="${ACC}" stroke-width="6"/>`,
  gift: () => R('M50,130 L250,130 L250,175 L50,175 Z') + R('M65,175 L65,260 L235,260 L235,175') + R('M150,130 L150,260', 7, ACC) + R('M150,130 C120,80 80,85 95,115 C100,125 130,130 150,130 C170,130 200,125 205,115 C220,85 180,80 150,130 Z', 6, ACC),
  dice: () => R('M50,90 L170,80 L180,200 L60,210 Z') + R('M150,110 L260,130 L240,245 L130,225', 7) + [[90, 120], [140, 170], [115, 145]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="${INK}"/>`).join('') + [[205, 165], [180, 200]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="${ACC}"/>`).join(''),
  snowflake: () => [0, 60, 120].map(a => { const r = a * Math.PI / 180, dx = 110 * Math.sin(r), dy = 110 * Math.cos(r); return R(`M${150 - dx},${150 - dy} L${150 + dx},${150 + dy}`, 7); }).join('') + [0, 60, 120, 180, 240, 300].map(a => { const r = a * Math.PI / 180, x = 150 + 75 * Math.sin(r), y = 150 - 75 * Math.cos(r), l = a - 35, q = a + 35; return R(`M${x + 25 * Math.sin(l * Math.PI / 180)},${y - 25 * Math.cos(l * Math.PI / 180)} L${x},${y} L${x + 25 * Math.sin(q * Math.PI / 180)},${y - 25 * Math.cos(q * Math.PI / 180)}`, 5, ACC); }).join(''),
  podium: () => R('M40,260 L40,180 L110,180 L110,260 M110,260 L110,120 L190,120 L190,260 M190,260 L190,200 L260,200 L260,260 M20,260 L280,260') + `<text x="150" y="105" text-anchor="middle" font-family="AD" font-size="44" fill="${ACC}">1</text><text x="75" y="168" text-anchor="middle" font-family="AD" font-size="34" fill="${INK}">2</text><text x="225" y="188" text-anchor="middle" font-family="AD" font-size="34" fill="${INK}">3</text>`,
  door: () => R('M70,40 L200,40 L200,265 L70,265 Z') + R('M200,60 L250,80 L250,250 L200,265', 6, ACC) + `<circle cx="180" cy="160" r="8" fill="${INK}"/>` + R('M30,265 L290,265', 7),
  speech: () => R('M40,60 L260,55 L262,190 L130,195 L80,250 L90,195 L42,198 Z') + [100, 150, 200].map(x => `<circle cx="${x}" cy="126" r="13" fill="${ACC}"/>`).join(''),
  loop: () => R('M70,150 C70,90 115,62 160,64 C210,68 238,100 240,138') + R('M212,118 L240,145 L265,116') + R('M230,170 C228,222 185,248 140,246 C92,242 62,210 62,170', 7, ACC) + R('M88,192 L62,165 L38,194', 7, ACC),
  car: () => R('M30,200 L45,150 L90,145 L122,100 L200,98 L236,145 L270,152 L275,200 Z') + R('M132,112 L195,110 L216,142 L112,144 Z', 5) + R('M60,175 L80,175', 6, ACC) +
    [90, 222].map(x => `<circle cx="${x}" cy="205" r="28" fill="${BG}" stroke="${INK}" stroke-width="7"/>`).join(''),
  trophy: () => R('M95,50 L205,50 C205,130 185,165 150,170 C115,165 95,130 95,50 Z') + R('M95,72 C52,72 55,128 104,126', 6) + R('M205,72 C248,72 245,128 196,126', 6) + R('M150,170 L150,212') + R('M108,252 L192,252 L184,214 L116,214 Z') +
    R('M150,78 L159,100 L182,101 L164,115 L170,138 L150,125 L130,138 L136,115 L118,101 L141,100 Z', 5, ACC),
  bench: () => R('M30,150 L270,145', 9) + R('M38,105 L262,100', 6) + R('M60,103 L60,150 M240,100 L240,147', 5) + R('M62,150 L55,232 M238,147 L246,232', 7) + `<circle cx="150" cy="232" r="24" fill="none" stroke="${ACC}" stroke-width="6"/>` + R('M138,222 L162,242 M162,222 L138,242', 4, ACC),
  calendar: () => R('M45,70 L255,68 L258,255 L48,258 Z') + R('M46,115 L256,113', 6) + R('M95,45 L95,90 M205,45 L205,90') +
    [[85, 160], [135, 160], [85, 215], [135, 215]].map(([x, y]) => R(`M${x - 10},${y - 10} L${x + 10},${y + 10} M${x + 10},${y - 10} L${x - 10},${y + 10}`, 5)).join('') + `<circle cx="200" cy="190" r="30" fill="none" stroke="${ACC}" stroke-width="7"/>`,
  bag: () => R('M40,130 L260,125 L266,242 L46,247 Z') + R('M100,128 C100,70 200,68 200,126', 7) + R('M48,168 L262,163', 5, ACC) + R('M150,165 L150,190', 6, ACC),
  eye: () => R('M25,150 C90,68 210,68 275,150 C210,232 90,232 25,150 Z') + `<circle cx="150" cy="150" r="40" fill="none" stroke="${INK}" stroke-width="7"/><circle cx="150" cy="150" r="15" fill="${ACC}"/>`,
  magnifier: () => `<circle cx="125" cy="125" r="78" fill="none" stroke="${INK}" stroke-width="8"/>` + R('M182,182 L258,258', 14) + R('M88,148 L112,122 L132,138 L165,100', 7, ACC),
  siblings: () => `<circle cx="95" cy="60" r="30" fill="none" stroke="${INK}" stroke-width="7"/>` + R('M95,90 L95,190 M95,120 L58,165 M95,120 L135,160 M95,190 L72,270 M95,190 L118,270') +
    `<circle cx="210" cy="120" r="24" fill="none" stroke="${ACC}" stroke-width="7"/>` + R('M210,144 L210,215 M210,165 L180,198 M210,165 L240,195 M210,215 L192,270 M210,215 L228,270', 7, ACC),
  book: () => R('M150,90 C110,70 70,70 35,80 L35,230 C70,220 110,220 150,240 C190,220 230,220 265,230 L265,80 C230,70 190,70 150,90 Z') + R('M150,90 L150,238', 6) +
    R('M60,115 L125,112 M60,145 L125,142 M60,175 L110,173', 5) + R('M175,112 L240,115 M175,142 L240,145', 5, ACC),
  tear: () => R('M150,40 C190,110 225,150 225,190 C225,235 190,262 150,262 C110,262 75,235 75,190 C75,150 110,110 150,40 Z', 8, ACC) + R('M115,195 C115,215 125,228 140,232', 5, ACC),
  face: () => `<circle cx="150" cy="150" r="105" fill="none" stroke="${INK}" stroke-width="7"/>` + R('M100,125 L125,128 M175,128 L200,125', 7) + R('M120,195 C135,185 165,185 180,195', 7) + R('M240,95 C265,90 275,70 268,52 M255,120 C285,120 300,100 296,80', 5, ACC),
  clock: () => `<circle cx="150" cy="150" r="108" fill="none" stroke="${INK}" stroke-width="7"/>` + R('M150,150 L150,80', 8) + R('M150,150 L205,175', 8, ACC) + [0, 90, 180, 270].map(a => { const r = a * Math.PI / 180; return R(`M${150 + 88 * Math.sin(r)},${150 - 88 * Math.cos(r)} L${150 + 100 * Math.sin(r)},${150 - 100 * Math.cos(r)}`, 6); }).join(''),
};
const doodle =(name, size = 330) => `<svg class="dd" viewBox="-20 -10 340 320" overflow="visible" width="${size}" height="${size}"><g>${ICONS[name]()}</g></svg>`;
function slide(s, i) {
  const swipe = total > 1 ? `<div style="position:absolute;right:70px;bottom:44px;font-size:30px" class="a">przesuń →</div>` : '';
  if (s.kind === 'cover' && s.layout === 'doodle') {
    return `<div class="c" style="top:0;bottom:110px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:56px">
      <div style="font-size:${len(s.text) < 45 ? 84 : 72}px;line-height:1.25">${hl(s.text)}</div>${doodle(s.icon, 440)}</div>${swipe}${foot(i)}`;
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
      <div style="font-size:70px;line-height:1.2;position:relative;opacity:.75;display:inline-block;align-self:center">${hl(s.old)}<svg style="position:absolute;left:-20px;top:34%;width:calc(100% + 40px);height:60px" viewBox="0 0 400 60" preserveAspectRatio="none">${R('M5,40 C100,20 220,45 395,15', 6, ACC)}</svg></div>
      <svg width="60" height="80" style="align-self:center" viewBox="0 0 60 80">${R('M30,5 L30,70 M10,50 L30,72 L50,50', 7)}</svg>
      <div style="font-size:82px;line-height:1.2">${hl(s.new)}</div>
      ${s.text ? `<div style="font-size:52px;line-height:1.3;opacity:.85">${hl(s.text)}</div>` : ''}</div>${swipe}${foot(i)}`;
  }
  if (s.kind === 'cover' && s.layout === 'marker') {
    const mk = qq(s.text).replace(/\*([^*]+)\*/g, (m, x) => '*' + x.split('\n').join('*\n*') + '*').replace(/&/g, '&amp;').split('\n').map(l => l.replace(/\*(.+?)\*/g, `<span style="background:linear-gradient(transparent 55%, ${spec.bg === 'khaki' ? '#F4F1E6' : '#FCE86A'} 55%, ${spec.bg === 'khaki' ? '#F4F1E6' : '#FCE86A'} 92%, transparent 92%);padding:0 6px">$1</span>`)).join('<br>');
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
    return `<div style="position:absolute;left:90px;right:90px;top:0;bottom:110px;display:flex;flex-direction:column;justify-content:center"><div>
      <div class="a" style="font-size:120px;line-height:1">${n}.</div>
      <div style="font-size:74px;line-height:1.2;margin:30px 0 44px">${hl(s.title)}</div>
      <div style="font-size:${len(s.body) < 160 ? 54 : 48}px;line-height:1.45">${hl(s.body)}</div></div>${s.icon ? `<div style="margin-top:60px;align-self:center">${doodle(s.icon, 260)}</div>` : ''}</div>${foot(i)}`;
  }
  return `<div class="c" style="top:0;bottom:0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:40px">
    ${s.icon ? doodle(s.icon, 240) : ''}<div style="font-size:${len(s.text) < 60 ? 78 : 64}px;line-height:1.25">${hl(s.text)}</div>
    <svg width="200" height="26"><path d="M5,15 C50,4 100,24 150,10 S190,10 195,14" fill="none" stroke="${ACC}" stroke-width="6" stroke-linecap="round"/></svg>
    <div style="font-size:48px;line-height:1.45;opacity:.9">${hl(s.cta || 'Zapisz na później i wyślij innemu rodzicowi.')}</div></div>${foot(i)}`;
}
(async () => {
  const { chromium } = require('playwright');
  const d = fs.readdirSync('/opt/pw-browsers').filter(x => x.startsWith('chromium_headless_shell')).sort().reverse()[0];
  const ex = d && [`/opt/pw-browsers/${d}/chrome-linux/headless_shell`, `/opt/pw-browsers/${d}/chrome-headless-shell-linux64/chrome-headless-shell`].find(f => fs.existsSync(f));
  const b = await chromium.launch({ executablePath: ex || undefined, args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  fs.mkdirSync(outDir, { recursive: true });
  const tmp = path.join(__dirname, `.tmp-${process.pid}.html`);
  for (let i = 0; i < total; i++) {
    fs.writeFileSync(tmp, `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${slide(spec.slides[i], i)}</body></html>`);
    await p.goto('file://' + tmp); await p.evaluate(() => document.fonts.ready);
    // przytnij rysunek do faktycznych krawędzi, żeby odstęp od tekstu był równy
    await p.evaluate(() => document.querySelectorAll('svg.dd').forEach(sv => {
      const b = sv.querySelector('g').getBBox(), pad = 8, H = sv.height.baseVal.value;
      sv.setAttribute('viewBox', `${b.x - pad} ${b.y - pad} ${b.width + 2 * pad} ${b.height + 2 * pad}`);
      sv.setAttribute('height', H); sv.setAttribute('width', H * (b.width + 2 * pad) / (b.height + 2 * pad));
    }));
    await p.screenshot({ path: path.join(outDir, `${i + 1}.png`) });
  }
  fs.unlinkSync(tmp); await b.close();
})();
