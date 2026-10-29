// Usage: node carousel.js spec.json outDir
// spec: { "brand": "sedzia"|"rodzina", "slides": [
//   {"kind":"cover","text":"Hasło z *żółtymi* słowami\\ndruga linia"},
//   {"kind":"point","title":"Krótki tytuł","body":"1–3 zdania wyjaśnienia"},
//   {"kind":"end","text":"Pytanie albo zadanie na koniec","cta":"Zapisz i wróć przed meczem"} ] }
const fs = require('fs');
const path = require('path');
const { page } = require('./kit');
const { scene } = require('./scenes');
const [, , specPath, outDir] = process.argv;
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
const B = {
  rodzina: { l1: 'SPORTOWA', l2: 'RODZINA', handle: 'sportowarodzina' },
  sedzia: { l1: 'SĘDZIA', l2: 'Z GŁOWĄ', handle: 'sedziazglowa' },
}[spec.brand];
const qq = s => String(s).replace(/[„“"]([^„”“"]+)[”"]/g, '_$1_').replace(/[„”“"]/g, '');
const em = s => s.replace(/_([^_]+)_/g, '<em class="q">$1</em>');
const hl = s => qq(s).replace(/\\n/g, '\n').replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .split('\n').map(l => em(l.replace(/\*(.+?)\*/g, '<span class="y">$1</span>'))).join('<br>');
const len = s => qq(s).replace(/[*_]/g, '').length;
const shield = `file://${__dirname}/sst_shield.png`;
const total = spec.slides.length;
const THEMES = {
  red: { bg: 'linear-gradient(180deg,#AE4549 0%,#7A2423 100%)', fg: '#FFFFFF', acc: '#FCE86A', sh: 'none' },
  dark: { bg: 'radial-gradient(120% 90% at 85% 0%,#4A1E21 0%,#1A1719 55%,#141215 100%)', fg: '#FFFFFF', acc: '#FCE86A', sh: 'none' },
  yellow: { bg: '#FCE86A', fg: '#2B1515', acc: '#9E3236', sh: 'brightness(0) opacity(.8)' },
  photo: { bg: '#141215', fg: '#FFFFFF', acc: '#FCE86A', sh: 'none' },
  cream: { bg: '#F4EEE4', fg: '#2B1515', acc: '#AE4549', sh: 'brightness(0) opacity(.75)' },
};
const themeOf = s => THEMES[s.theme || spec.theme || 'red'];
const themeCss = t => `<style>body{background:${t.bg}!important;color:${t.fg}!important}.y{color:${t.acc}!important}.acc-bg{background:${t.acc}!important}.acc{color:${t.acc}!important}.sh{filter:${t.sh}}</style>`;

function footer(i) {
  if (spec.footer === 'center') return `<div style="position:absolute;left:0;right:0;bottom:70px;display:flex;flex-direction:column;align-items:center;gap:10px">
    <img class="sh" src="${shield}" style="height:64px"><div class="wm" style="font-size:24px">${B.l1}<br>${B.l2}</div>
    <div style="font-family:Pop;font-weight:500;font-size:20px;opacity:.85;margin-top:4px">@${B.handle}${total > 1 ? ' · ' + (i + 1) + '/' + total : ''}</div></div>`;
  return `<div style="position:absolute;left:80px;right:80px;bottom:64px;display:flex;align-items:center;justify-content:space-between">
    <div style="display:flex;align-items:center;gap:16px"><img class="sh" src="${shield}" style="height:52px">
      <div class="wm" style="font-size:22px;text-align:left">${B.l1}<br>${B.l2}</div></div>
    <div style="font-family:Pop;font-weight:500;font-size:22px;opacity:.85">@${B.handle} · ${i + 1}/${total}</div></div>`;
}

const SICONS = {
  gwizdek: '<circle cx="34" cy="50" r="22"/><path d="M48 32 L88 22 L92 40 L56 46"/><circle cx="34" cy="50" r="6" fill="currentColor"/>',
  kartka: '<rect x="22" y="22" width="38" height="56" rx="5" transform="rotate(-12 41 50)"/><rect x="44" y="18" width="38" height="56" rx="5" transform="rotate(8 63 46)" fill="currentColor"/>',
  zegar: '<circle cx="50" cy="50" r="36"/><path d="M50 26 V50 L66 60"/><path d="M40 8 H60"/>',
  bateria: '<rect x="12" y="30" width="68" height="40" rx="6"/><path d="M80 42 H88 V58 H80"/><rect x="20" y="38" width="16" height="24" fill="currentColor"/>',
  flaga: '<path d="M26 90 V10"/><path d="M26 14 H80 L68 32 L80 50 H26" fill="currentColor"/>',
  dom: '<path d="M12 50 L50 16 L88 50"/><path d="M22 42 V86 H78 V42"/><path d="M42 86 V62 H58 V86"/>',
  notes: '<rect x="20" y="12" width="60" height="78" rx="6"/><path d="M34 34 H66 M34 50 H66 M34 66 H54"/>',
  serce: '<path d="M50 84 L16 50 Q4 36 14 22 Q30 6 50 28 Q70 6 86 22 Q96 36 84 50 Z"/>',
  ucho: '<path d="M30 40 Q30 10 56 10 Q82 10 80 40 Q78 56 64 64 Q56 70 56 80 Q54 92 40 90"/><path d="M44 42 Q46 28 58 28 Q68 30 66 42"/>',
  oko: '<path d="M8 50 Q50 10 92 50 Q50 90 8 50 Z"/><circle cx="50" cy="50" r="14"/><circle cx="50" cy="50" r="5" fill="currentColor"/>',
  dymek: '<path d="M14 18 H86 V66 H44 L24 84 V66 H14 Z"/><path d="M30 36 H70 M30 50 H58"/>',
  glowa: '<path d="M30 86 V70 Q14 62 16 42 Q18 14 50 12 Q82 14 84 40 L92 56 L82 58 V72 H64 V86"/><path d="M42 40 Q50 30 58 40 Q66 50 54 56"/>',
  waga: '<path d="M50 14 V84 M30 84 H70 M18 30 H82"/><path d="M18 30 L8 54 H28 Z M82 30 L72 54 H92 Z"/>',
};
const icon = (n, size, cls) => `<svg viewBox="0 0 100 100" width="${size}" height="${size}" class="${cls || 'acc'}" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">${SICONS[n] || SICONS.gwizdek}</svg>`;
const swipe = (b) => total > 1 ? `<div style="position:absolute;right:80px;bottom:${b || 170}px;font-family:Pop;font-weight:500;font-size:30px" class="acc">przesuń →</div>` : '';

function slideHtml(s, i) {
  // NOWE UKŁADY OKŁADEK (24.10.2026) dla różnorodności siatki
  if (s.kind === 'cover' && s.style === 'split') {
    // górna połowa w kolorze akcentu z pytaniem, dolna z dopowiedzeniem
    // na żółtym tle górna połowa w ciemniejszym żółtym (okładka zostaje żółta w siatce), akcent czerwony
    const yl = themeOf(s) === THEMES.yellow;
    const topBg = yl ? 'background:#EFCF3C!important' : '', topFg = '#2B1515', topY = '#9E3236';
    return `<style>.split-top .y{color:${topY}!important}</style><div style="position:absolute;left:0;right:0;top:0;height:640px;box-sizing:border-box;padding:0 90px 60px;display:flex;flex-direction:column;justify-content:flex-end;${topBg}" class="acc-bg split-top">
        <div style="font-family:Pop;font-weight:600;font-size:26px;letter-spacing:6px;opacity:.75;margin-bottom:26px;color:${topFg}">${s.label || 'PYTANIE'}</div>
        <div style="font-weight:800;font-size:${len(s.text) < 40 ? 84 : 70}px;line-height:1.12;color:${topFg};text-wrap:balance">${hl(s.text)}</div></div>
      <div style="position:absolute;left:90px;right:90px;top:720px;font-family:Pop;font-weight:500;font-size:44px;line-height:1.35;text-wrap:balance">${hl(s.sub || '')}</div>
      ${swipe()}${footer(i)}`;
  }
  if (s.kind === 'cover' && s.style === 'left') {
    // editorialowy: etykieta u góry, wielkie hasło przy lewej krawędzi, cienka linia
    return `<div style="position:absolute;left:90px;right:90px;top:170px;display:flex;align-items:center;gap:22px">
        <div style="width:70px;height:4px" class="acc-bg"></div>
        <div style="font-family:Pop;font-weight:600;font-size:26px;letter-spacing:6px" class="acc">${s.label || 'Z BOISKA'}</div></div>
      <div style="position:absolute;left:90px;right:120px;bottom:300px;font-weight:800;font-size:${len(s.text) < 30 ? 120 : len(s.text) < 55 ? 96 : 78}px;line-height:1.02;letter-spacing:-1px;text-wrap:balance">${hl(s.text)}</div>
      ${swipe()}${footer(i)}`;
  }
  if (s.kind === 'cover' && s.style === 'icon') {
    // duża ikona liniowa na środku, krótkie hasło pod nią
    return `<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 110px 80px;box-sizing:border-box;gap:56px">
        <div style="width:300px;height:300px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:4px solid currentColor;opacity:.98">${icon(s.icon, 170)}</div>
        <div style="font-weight:800;font-size:${len(s.text) < 40 ? 76 : 64}px;line-height:1.15;text-align:center;text-wrap:balance">${hl(s.text)}</div></div>
      ${swipe()}${footer(i)}`;
  }
  if (s.kind === 'cover' && s.style === 'versus') {
    // dwa pojęcia rozdzielone ukośną linią
    return `<svg width="1080" height="1350" style="position:absolute;inset:0"><line x1="140" y1="1012" x2="940" y2="332" stroke="currentColor" stroke-width="4" opacity=".35"/></svg>
      <div style="position:absolute;left:90px;top:230px;font-weight:800;font-size:112px;line-height:1">${hl(s.a)}</div>
      <div style="position:absolute;left:90px;top:400px;font-family:Pop;font-weight:500;font-size:36px;opacity:.8">${hl(s.aSub || '')}</div>
      <div style="position:absolute;right:90px;top:760px;font-weight:800;font-size:112px;line-height:1;text-align:right" class="acc">${hl(s.b)}</div>
      <div style="position:absolute;right:90px;top:930px;font-family:Pop;font-weight:500;font-size:36px;opacity:.8;text-align:right">${hl(s.bSub || '')}</div>
      <div style="position:absolute;left:470px;top:640px;width:140px;height:64px;border-radius:32px;background:#1A1719;border:2px solid rgba(255,255,255,.35);display:flex;align-items:center;justify-content:center;font-family:Pop;font-weight:600;font-size:28px;letter-spacing:4px">CZY</div>
      ${swipe()}${footer(i)}`;
  }
  if (s.kind === 'cover' && s.scene) {
    const fsz = len(s.text) < 40 ? 92 : len(s.text) < 70 ? 78 : 66;
    return `${scene(s.scene)}<div style="position:absolute;left:90px;right:90px;bottom:250px">
      <div style="font-weight:800;font-size:${fsz}px;line-height:1.18;text-wrap:balance;text-shadow:0 4px 24px rgba(0,0,0,.6)">${hl(s.text)}</div></div>
      ${total > 1 ? `<div style="position:absolute;right:80px;bottom:170px;font-family:Pop;font-weight:500;font-size:30px" class="acc">przesuń →</div>` : ""}${footer(i)}`;
  }
  if (s.kind === 'cover' && s.style === 'quote') {
    const fsz = len(s.text) < 50 ? 84 : len(s.text) < 90 ? 70 : 60;
    return `<div style="position:absolute;left:100px;right:100px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center">
      <div style="width:110px;height:8px;margin-bottom:48px" class="acc-bg"></div>
      <div style="font-weight:600;font-style:italic;font-size:${fsz}px;line-height:1.2;text-wrap:balance">${hl(s.text)}</div>
      <div style="width:110px;height:6px;margin-top:44px" class="acc-bg"></div></div>
      ${total > 1 ? `<div style="position:absolute;right:80px;bottom:170px;font-family:Pop;font-weight:500;font-size:30px" class="acc">przesuń →</div>` : ""}${footer(i)}`;
  }
  if (s.kind === 'cover' && s.style === 'number') {
    return `<div style="position:absolute;left:100px;right:100px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center">
      <div class="acc" style="font-family:Raj;font-weight:700;font-size:340px;line-height:.85">${s.big}</div>
      <div style="font-weight:800;font-size:${len(s.text) < 50 ? 80 : 66}px;line-height:1.18;margin-top:20px;text-wrap:balance">${hl(s.text)}</div></div>
      ${total > 1 ? `<div style="position:absolute;right:80px;bottom:170px;font-family:Pop;font-weight:500;font-size:30px" class="acc">przesuń →</div>` : ""}${footer(i)}`;
  }
  if (s.kind === 'cover' && spec.footer === 'center') {
    const fsz = len(s.text) < 30 ? 96 : len(s.text) < 55 ? 82 : 68;
    return `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:0 90px;box-sizing:border-box">
      <div style="font-weight:800;font-size:${fsz}px;line-height:1.28;text-align:center;text-wrap:balance">${hl(s.text)}</div></div>
      ${total > 1 ? `<div style="position:absolute;right:80px;bottom:120px;font-family:Pop;font-weight:500;font-size:28px" class="acc">przesuń →</div>` : ""}${footer(i)}`;
  }
  if (s.kind === 'cover') {
    const fsz = len(s.text) < 40 ? 104 : len(s.text) < 70 ? 88 : 74;
    return `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:0 90px;box-sizing:border-box">
      <div style="font-weight:800;font-size:${fsz}px;line-height:1.22;text-align:center;text-wrap:balance">${hl(s.text)}</div></div>
      ${total > 1 ? `<div style="position:absolute;right:80px;bottom:170px;font-family:Pop;font-weight:500;font-size:30px" class="acc">przesuń →</div>` : ""}${footer(i)}`;
  }
  if (s.kind === 'point' && (s.pstyle || spec.pointStyle) === 'small') {
    // mały numer w kółku obok tytułu, większy tekst, ikona na dole
    const n = spec.slides.slice(0, i + 1).filter(x => x.kind === 'point').length;
    const bsz = len(s.body) < 140 ? 52 : len(s.body) < 230 ? 46 : 40;
    return `<div style="position:absolute;left:90px;right:90px;top:190px">
      <div style="display:flex;align-items:center;gap:28px;margin-bottom:44px">
        <div class="acc-bg" style="flex:none;width:96px;height:96px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:Raj;font-weight:700;font-size:56px;color:${themeOf(s) === THEMES.yellow ? '#FFFFFF' : '#2B1515'}">${n}</div>
        <div style="font-weight:800;font-size:62px;line-height:1.12;text-wrap:balance">${hl(s.title)}</div></div>
      <div style="font-family:Pop;font-weight:500;font-size:${bsz}px;line-height:1.45;opacity:.95">${hl(s.body)}</div></div>
      ${s.icon ? `<div style="position:absolute;left:90px;bottom:170px;opacity:.9">${icon(s.icon, 110)}</div>` : ''}${footer(i)}`;
  }
  if (s.kind === 'point' && (s.pstyle || spec.pointStyle) === 'bar') {
    // pionowy pasek akcentu po lewej, blady duży numer w prawym górnym rogu, ikona obok tytułu
    const n = spec.slides.slice(0, i + 1).filter(x => x.kind === 'point').length;
    const bsz = len(s.body) < 140 ? 48 : len(s.body) < 230 ? 43 : 38;
    return `<div style="position:absolute;right:70px;top:90px;font-family:Raj;font-weight:700;font-size:300px;line-height:1;opacity:.13">${String(n).padStart(2, '0')}</div>
      <div class="acc-bg" style="position:absolute;left:90px;top:300px;width:12px;height:${len(s.body) < 140 ? 520 : 620}px;border-radius:6px"></div>
      <div style="position:absolute;left:144px;right:90px;top:300px">
        <div style="display:flex;align-items:center;gap:22px;margin-bottom:38px">${s.icon ? `<div style="flex:none">${icon(s.icon, 84)}</div>` : ''}
          <div style="font-weight:800;font-size:64px;line-height:1.12;text-wrap:balance">${hl(s.title)}</div></div>
        <div style="font-family:Pop;font-weight:500;font-size:${bsz}px;line-height:1.45;opacity:.95">${hl(s.body)}</div></div>${footer(i)}`;
  }
  if (s.kind === 'point') {
    const n = spec.slides.slice(0, i + 1).filter(x => x.kind === 'point').length;
    const bsz = len(s.body) < 140 ? 48 : len(s.body) < 230 ? 42 : 37;
    return `<div style="position:absolute;left:90px;right:90px;top:170px">
      <div style="font-family:Raj;font-weight:700;font-size:150px;line-height:1" class="acc">${String(n).padStart(2, '0')}</div>
      <div style="width:110px;height:6px;margin:26px 0 40px" class="acc-bg"></div>
      <div style="font-weight:800;font-size:66px;line-height:1.15;margin-bottom:36px;text-wrap:balance">${hl(s.title)}</div>
      <div style="font-family:Pop;font-weight:500;font-size:${bsz}px;line-height:1.45;opacity:.95">${hl(s.body)}</div></div>${footer(i)}`;
  }
  // end
  return `<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 100px;box-sizing:border-box;gap:46px">
    <div style="font-weight:800;font-size:${len(s.text) < 70 ? 78 : 64}px;line-height:1.22;text-align:center;text-wrap:balance">${hl(s.text)}</div>
    <div style="width:110px;height:6px" class="acc-bg"></div>
    <div style="font-family:Pop;font-weight:500;font-size:36px;line-height:1.4;text-align:center;opacity:.92">${hl(s.cta || 'Zapisz na później i wyślij komuś, komu się przyda.')}</div></div>${footer(i)}`;
}

(async () => {
  const { chromium } = require('playwright');
  const dirs = fs.readdirSync('/opt/pw-browsers').filter(d => d.startsWith('chromium_headless_shell')).sort().reverse();
  const exe = dirs.length ? `/opt/pw-browsers/${dirs[0]}/chrome-linux/headless_shell` : undefined;
  const b = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  fs.mkdirSync(outDir, { recursive: true });
  const tmp = path.join(__dirname, `.tmp-${process.pid}.html`);
  for (let i = 0; i < total; i++) {
    fs.writeFileSync(tmp, page(themeCss(themeOf(spec.slides[i])) + slideHtml(spec.slides[i], i), { w: 1080, h: 1350 }));
    await p.goto('file://' + tmp);
    await p.evaluate(() => document.fonts.ready);
    const out = path.join(outDir, `${i + 1}.png`);
    await p.screenshot({ path: out });
    console.log('ok', out);
  }
  await b.close();
})();
