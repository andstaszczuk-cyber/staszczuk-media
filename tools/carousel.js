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

function slideHtml(s, i) {
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
