// Relacja IG 1080x1920 z metaforą Andrzeja + jego zdjęciem.
// node metafora.js spec.json out.png
// spec: {photo:"metafory/zdjecia/9315_kolor.jpg", layout:"L1".."L12", palette:"red|black|cream|mono",
//        font:"raj|anton|bebas|playfair", focus:0-100 (pion. położenie kadru, %), headline:"...", body:"...", kicker:"...", tilt:-4..4,
//        art:"gauge|target|waves|..." albo svg:"<własne wnętrze svg 1000x1000 z tokenami {acc}{ink}{soft}{dark}{bg2}>" – dla layoutów G1–G8 (bez zdjęcia),
//        cta:"..." (opcjonalnie: pasek z odesłaniem, np. do bloga), ctaPos:"inline|top|bottom" (domyślnie inline: zaraz pod tekstem), ctaStyle:"pill|bar|tag"}
// W headline/body *słowo* = wyróżnienie kolorem akcentu. \n = nowa linia.
const fs = require('fs'), path = require('path');
const { render } = require('./kit');
const F = p => 'file://' + path.join(__dirname, 'node_modules/@fontsource', p);
const W = 1080, H = 1920;
const spec = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const out = process.argv[3];
const ROOT = path.join(__dirname, '..');
const img = spec.photo ? 'file://' + path.join(ROOT, spec.photo) : '';
const { motyw } = require('./motywy');
const focus = spec.focus ?? 30;
const tilt = spec.tilt ?? -3;

const PAL = {
  red:   { bg: 'linear-gradient(180deg,#AE4549 0%,#7A2423 100%)', solid: '#8E3236', ink: '#FFFFFF', acc: '#FCE86A', soft: 'rgba(255,255,255,.82)', dark: '#3A0D0E' },
  black: { bg: 'linear-gradient(180deg,#1C1B1F 0%,#0B0B0C 100%)', solid: '#141416', ink: '#FFFFFF', acc: '#FCE86A', soft: 'rgba(255,255,255,.78)', dark: '#000' },
  cream: { bg: 'linear-gradient(180deg,#F6F1E7 0%,#EDE4D3 100%)', solid: '#F3ECDF', ink: '#2A1414', acc: '#AE4549', soft: 'rgba(42,20,20,.78)', dark: '#2A1414' },
  mono:  { bg: 'linear-gradient(180deg,#2B2B2E 0%,#121214 100%)', solid: '#1E1E21', ink: '#FFFFFF', acc: '#E0565B', soft: 'rgba(255,255,255,.8)', dark: '#000' },
};
const P = PAL[spec.palette] || PAL.red;
const FONTS = {
  raj: { fam: 'Raj', w: 700, tt: 'uppercase', ls: '.02em', lh: .95, k: 1 },
  anton: { fam: 'Anton', w: 400, tt: 'uppercase', ls: '.01em', lh: 1.02, k: .9 },
  bebas: { fam: 'Bebas', w: 400, tt: 'uppercase', ls: '.03em', lh: .95, k: 1.08 },
  playfair: { fam: 'Play', w: 400, tt: 'none', ls: '0', lh: 1.08, k: .78 },
};
const FT = FONTS[spec.font] || FONTS.raj;

const esc = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
const fmt = (s, cls = 'hl') => esc(s).replace(/\*(.+?)\*/g, `<span class="${cls}">$1</span>`).replace(/\n/g, '<br>');
const hlen = (spec.headline || '').replace(/\*/g, '').length;
// rozmiar nagłówka zależny od długości
const hs = Math.round((hlen <= 12 ? 150 : hlen <= 20 ? 128 : hlen <= 30 ? 108 : 92) * FT.k);
const blen = (spec.body || '').length;
const bs = blen <= 90 ? 58 : blen <= 140 ? 50 : blen <= 190 ? 44 : 39;

const fontCss = `
@font-face{font-family:Raj;font-weight:700;src:url(${F('rajdhani/files/rajdhani-latin-ext-700-normal.woff2')});unicode-range:U+0100-024F}
@font-face{font-family:Raj;font-weight:700;src:url(${F('rajdhani/files/rajdhani-latin-700-normal.woff2')})}
@font-face{font-family:Pop;font-weight:500;src:url(${F('poppins/files/poppins-latin-ext-500-normal.woff2')});unicode-range:U+0100-024F}
@font-face{font-family:Pop;font-weight:500;src:url(${F('poppins/files/poppins-latin-500-normal.woff2')})}
@font-face{font-family:Pop;font-weight:800;src:url(${F('poppins/files/poppins-latin-ext-800-normal.woff2')});unicode-range:U+0100-024F}
@font-face{font-family:Pop;font-weight:800;src:url(${F('poppins/files/poppins-latin-800-normal.woff2')})}
@font-face{font-family:Pop;font-weight:600;font-style:italic;src:url(${F('poppins/files/poppins-latin-ext-600-italic.woff2')});unicode-range:U+0100-024F}
@font-face{font-family:Pop;font-weight:600;font-style:italic;src:url(${F('poppins/files/poppins-latin-600-italic.woff2')})}
@font-face{font-family:Anton;src:url(${F('anton/files/anton-latin-ext-400-normal.woff2')});unicode-range:U+0100-024F}
@font-face{font-family:Anton;src:url(${F('anton/files/anton-latin-400-normal.woff2')})}
@font-face{font-family:Bebas;src:url(${F('bebas-neue/files/bebas-neue-latin-ext-400-normal.woff2')});unicode-range:U+0100-024F}
@font-face{font-family:Bebas;src:url(${F('bebas-neue/files/bebas-neue-latin-400-normal.woff2')})}
@font-face{font-family:Play;src:url(${F('playfair-display/files/playfair-display-latin-ext-400-normal.woff2')});unicode-range:U+0100-024F}
@font-face{font-family:Play;src:url(${F('playfair-display/files/playfair-display-latin-400-normal.woff2')})}
@font-face{font-family:Play;font-style:italic;src:url(${F('playfair-display/files/playfair-display-latin-ext-400-italic.woff2')});unicode-range:U+0100-024F}
@font-face{font-family:Play;font-style:italic;src:url(${F('playfair-display/files/playfair-display-latin-400-italic.woff2')})}
@font-face{font-family:Hand;font-weight:500;src:url(${F('caveat/files/caveat-latin-ext-500-normal.woff2')});unicode-range:U+0100-024F}
@font-face{font-family:Hand;font-weight:500;src:url(${F('caveat/files/caveat-latin-500-normal.woff2')})}`;

const css = `${fontCss}
html,body{margin:0;width:${W}px;height:${H}px;overflow:hidden}
body{background:${P.bg};color:${P.ink};font-family:Pop,sans-serif;position:relative}
.h{font-family:${FT.fam};font-weight:${FT.w};text-transform:${FT.tt};letter-spacing:${FT.ls};line-height:${FT.lh};font-size:${hs}px}
.b{font-family:Pop;font-weight:500;font-size:${bs}px;line-height:1.42}
.hl{color:${P.acc}}
.mark{background:${P.acc};color:${P.dark};padding:0 .12em;box-decoration-break:clone;-webkit-box-decoration-break:clone}
.kick{font-family:Pop;font-weight:800;font-size:30px;letter-spacing:.18em;text-transform:uppercase}
.handle{display:none;position:absolute;left:0;right:0;bottom:120px;text-align:center;font-family:Pop;font-weight:500;font-size:32px;opacity:.85}
.ph{background-image:url('${img}');background-size:cover;background-position:50% ${focus}%}
.bw{filter:grayscale(1) contrast(1.05)}
.narrow .cta{white-space:normal!important;font-size:26px!important;line-height:1.3}
.cta{position:absolute;z-index:20;font-family:Pop;font-weight:800;font-size:31px;letter-spacing:.04em;white-space:nowrap}
`;
const ctaHtml = () => {
  if (!spec.cta || ctaUsed) return '';
  const pos = spec.ctaPos === 'bottom' ? 'bottom:248px' : 'top:212px';
  const st = spec.ctaStyle || 'pill';
  const txt = esc(spec.cta).replace(/\*(.+?)\*/g, '<u>$1</u>');
  if (st === 'bar') return `<div class="cta" style="${pos};left:0;right:0;text-align:center;padding:20px 0;background:${P.acc};color:${P.dark}">${txt} &rarr;</div>`;
  if (st === 'tag') return `<div class="cta" style="${pos};left:0;padding:18px 40px 18px 70px;background:${P.dark};color:#fff;border-left:14px solid ${P.acc}">${txt} &rarr;</div>`;
  return `<div style="position:absolute;${pos};left:0;right:0;display:flex;justify-content:center;z-index:20"><div class="cta" style="position:static;padding:18px 40px;border-radius:60px;background:${P.acc};color:${P.dark};box-shadow:0 10px 30px rgba(0,0,0,.35)">${txt} &rarr;</div></div>`;
};
const handle = (c = P.ink) => `<div class="handle" style="color:${c}">@psychologsportu</div>`;
const kick = (c = P.acc, extra = '') => spec.kicker ? `<div class="kick" style="color:${c};${extra}">${esc(spec.kicker)}</div>` : '';
const H1 = (style = '', cls = 'hl') => `<div class="h" style="${style}">${fmt(spec.headline, cls)}</div>`;
const ctaInline = () => (spec.cta && (spec.ctaPos || 'inline') === 'inline') ? `<div style="margin-top:38px"><span class="cta" style="position:static;display:inline-block;padding:16px 34px;border-radius:60px;background:${P.acc};color:${P.dark};font-size:29px">${esc(spec.cta)} &rarr;</span></div>` : '';
let ctaUsed = false;
const B1 = (style = '') => { const c = ctaInline(); if (c) ctaUsed = true; return `<div class="b" style="${style}">${fmt(spec.body)}</div>${c}`; };

const L = {
  // 1. Zdjęcie na całą wysokość, ciemny gradient od dołu, tekst na dole
  L1: () => `<div class="ph" style="position:absolute;inset:0"></div>
    <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 30%,rgba(0,0,0,.65) 55%,rgba(0,0,0,.92) 100%)"></div>
    <div style="position:absolute;left:80px;right:80px;bottom:330px;color:#fff">${kick()}<div style="height:24px"></div>${H1()}<div style="width:120px;height:8px;background:${P.acc};margin:40px 0"></div>${B1('color:#fff')}</div>${handle('#fff')}`,
  // 2. Zdjęcie u góry (58%), panel kolorowy z tekstem na dole, ukośne cięcie
  L2: () => `<div class="ph" style="position:absolute;left:0;right:0;top:0;height:1150px;clip-path:polygon(0 0,100% 0,100% 88%,0 100%)"></div>
    <div style="position:absolute;left:80px;right:80px;top:1110px">${H1()}<div style="height:34px"></div>${B1()}</div>${handle()}`,
  // 3. Polaroid przechylony + odręczny podpis
  L3: () => `<div style="position:absolute;top:130px;left:170px;width:740px;height:840px;background:#fff;padding:32px 32px 116px;box-shadow:0 30px 60px rgba(0,0,0,.45);transform:rotate(${tilt}deg)">
      <div class="ph" style="width:100%;height:100%"></div>
      <div style="position:absolute;left:0;right:0;bottom:22px;text-align:center;font-family:Hand;font-weight:500;font-size:62px;color:#2A1414">${esc((spec.kicker || '').toLowerCase())}</div></div>
    <div style="position:absolute;left:80px;right:80px;top:1250px">${H1()}<div style="height:30px"></div>${B1()}</div>${handle()}`,
  // 4. Okładka magazynu: zdjęcie pełne, ogromny nagłówek u góry
  L4: () => `<div class="ph" style="position:absolute;inset:0"></div>
    <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.85) 0%,rgba(0,0,0,.2) 38%,rgba(0,0,0,.1) 55%,rgba(0,0,0,.88) 85%)"></div>
    <div style="position:absolute;left:70px;right:70px;top:170px;color:#fff">${kick()}<div style="height:18px"></div>${H1()}</div>
    <div style="position:absolute;left:70px;right:70px;bottom:330px;color:#fff">${B1('color:#fff')}</div>${handle('#fff')}`,
  // 5. Tekst na górze na tle marki, zdjęcie w dużym kole na dole
  L5: () => `<div style="position:absolute;left:80px;right:80px;top:200px">${kick()}<div style="height:26px"></div>${H1()}<div style="height:34px"></div>${B1()}</div>
    <div class="ph" style="position:absolute;width:760px;height:760px;border-radius:50%;left:160px;bottom:300px;border:12px solid ${P.acc};box-shadow:0 20px 50px rgba(0,0,0,.4)"></div>${handle()}`,
  // 6. Duotone: czarno-białe zdjęcie z kolorową poświatą, tekst z zakreślaczem
  L6: () => `<div class="ph bw" style="position:absolute;inset:0"></div>
    <div style="position:absolute;inset:0;background:${P.solid};mix-blend-mode:color;opacity:.55"></div>
    <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 40%,rgba(0,0,0,.85) 70%)"></div>
    <div style="position:absolute;left:70px;right:70px;bottom:330px;color:#fff"><div class="h" style="color:${P.dark}"><span class="mark">${fmt(spec.headline, 'x')}</span></div><div style="height:40px"></div>${B1('color:#fff')}</div>${handle('#fff')}`,
  // 7. Żółta karteczka przyklejona na zdjęciu
  L7: () => `<div class="ph" style="position:absolute;inset:0"></div><div style="position:absolute;inset:0;background:rgba(0,0,0,.25)"></div>
    <div style="position:absolute;left:110px;right:110px;bottom:330px;background:#FCE86A;color:#2A1414;padding:70px 60px;transform:rotate(${tilt / 2}deg);box-shadow:0 25px 50px rgba(0,0,0,.45)">
      <div style="position:absolute;top:-28px;left:50%;width:180px;height:56px;margin-left:-90px;background:rgba(255,255,255,.55);transform:rotate(-3deg)"></div>
      <div class="h" style="color:#7A2423;font-size:${Math.round(hs * .78)}px">${fmt(spec.headline, 'x')}</div><div style="height:26px"></div>
      <div style="font-family:Hand;font-weight:500;font-size:${bs + 18}px;line-height:1.2">${esc(spec.body).replace(/\*(.+?)\*/g, '<u>$1</u>')}</div></div>${handle('#fff')}`,
  // 8. Zdjęcie w ramce z grubą obwódką, tekst pod spodem
  L8: () => `<div class="ph" style="position:absolute;left:90px;right:90px;top:250px;height:880px;outline:14px solid ${P.acc};outline-offset:22px"></div>
    <div style="position:absolute;left:90px;right:90px;top:1200px">${H1()}<div style="height:28px"></div>${B1()}</div>${handle()}`,
  // 9. Tekst najpierw: duży nagłówek, mały okrągły portret w rogu
  L9: () => `<div class="ph" style="position:absolute;width:300px;height:300px;border-radius:50%;right:80px;top:150px;border:8px solid ${P.acc}"></div>
    <div style="position:absolute;left:80px;right:80px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center">${kick()}<div style="height:26px"></div>${H1('font-size:' + Math.round(hs * 1.08) + 'px')}<div style="width:160px;height:10px;background:${P.acc};margin:50px 0"></div>${B1()}</div>${handle()}`,
  // 10. Ukośny pas z nagłówkiem przez zdjęcie
  L10: () => `<div class="ph" style="position:absolute;inset:0"></div><div style="position:absolute;inset:0;background:rgba(0,0,0,.3)"></div>
    <div style="position:absolute;left:-60px;right:-60px;top:${focus > 45 ? 300 : 900}px;background:${P.acc};color:${P.dark};padding:40px 120px;transform:rotate(${tilt}deg)">${H1('color:' + P.dark, 'x')}</div>
    <div style="position:absolute;left:80px;right:80px;top:${focus > 45 ? 760 : 1250}px;background:rgba(0,0,0,.72);padding:40px 46px;color:#fff">${B1('color:#fff')}</div>${handle('#fff')}`,
  // 11. Podział pionowy: wąskie zdjęcie po lewej, tekst po prawej (zdjęcie pionowe)
  L11: () => `<div class="ph" style="position:absolute;left:0;top:0;bottom:0;width:470px"></div>
    <div style="position:absolute;left:470px;top:0;bottom:0;width:10px;background:${P.acc}"></div>
    <div class="narrow" style="position:absolute;left:530px;right:56px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center">${kick()}<div style="height:22px"></div>${H1('font-size:' + Math.round(hs * (FT.fam === 'Play' ? 1 : .8)) + 'px')}<div style="height:40px"></div>${B1('font-size:' + Math.round(bs * 1.0) + 'px')}</div>
    <div class="handle" style="left:480px;color:${P.ink}">@psychologsportu</div>`,
  // 12. Kartka z cytatem: zdjęcie w tle rozmyte, biała karta, kursywa Playfair
  L12: () => `<div class="ph" style="position:absolute;inset:-40px;filter:blur(14px) brightness(.55)"></div>
    <div class="ph" style="position:absolute;left:300px;right:300px;top:150px;height:480px;border-radius:24px;box-shadow:0 20px 40px rgba(0,0,0,.5)"></div>
    <div style="position:absolute;left:80px;right:80px;top:720px;background:${spec.palette === 'cream' ? '#fff' : P.solid};padding:70px 60px;border-radius:24px;box-shadow:0 30px 60px rgba(0,0,0,.45)">
      ${kick()}<div style="height:20px"></div>${H1()}<div style="height:30px"></div><div style="font-family:Play;font-style:italic;font-size:${bs + 6}px;line-height:1.35;color:${P.ink}">${fmt(spec.body)}</div></div>${handle('#fff')}`,
};
const C = { acc: P.acc, ink: P.ink, soft: P.ink, dark: P.dark, bg2: P.solid };
const CI = { acc: P.dark, ink: P.dark, soft: P.dark, dark: P.acc, bg2: P.acc }; // na tle akcentu
const ART = (c = C) => motyw(spec.art, c, spec.svg);
Object.assign(L, {
  // G1. Ilustracja w górnej części, tekst pod nią
  G1: () => `<div style="position:absolute;left:150px;right:150px;top:210px;height:780px">${ART()}</div>
    <div style="position:absolute;left:80px;right:80px;top:1060px">${kick()}<div style="height:22px"></div>${H1()}<div style="height:30px"></div>${B1()}</div>`,
  // G2. Ogromna, przygaszona ilustracja w tle, tekst wyśrodkowany w pionie
  G2: () => `<div style="position:absolute;left:-260px;top:300px;width:1600px;height:1600px;opacity:.16;transform:rotate(${tilt * 3}deg)">${ART()}</div>
    <div style="position:absolute;left:90px;right:90px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center">${kick()}<div style="height:26px"></div>${H1('font-size:' + Math.round(hs * 1.1) + 'px')}<div style="width:160px;height:10px;background:${P.acc};margin:46px 0"></div>${B1()}</div>`,
  // G3. Pełne tło w kolorze akcentu, ciemny tekst i ilustracja
  G3: () => `<style>body{background:${P.acc}!important}.g3 .hl{color:${P.dark};text-decoration:underline;text-decoration-thickness:.12em;text-underline-offset:.12em}.g3 .cta{background:${P.dark}!important;color:${P.acc}!important}.g3 .kick{color:${P.dark}!important}</style>
    <div class="g3" style="position:absolute;inset:0;color:${P.dark}">
    <div style="position:absolute;left:80px;right:80px;top:210px">${kick(P.dark)}<div style="height:22px"></div>${H1('color:' + P.dark)}</div>
    <div style="position:absolute;left:240px;right:240px;top:${hlen > 20 ? 640 : 560}px;height:600px">${ART(CI)}</div>
    <div style="position:absolute;left:80px;right:80px;top:${hlen > 20 ? 1280 : 1200}px">${B1('color:' + P.dark)}</div></div>`,
  // G4. Ukośny blok z ilustracją u góry, tekst na dole
  G4: () => `<div style="position:absolute;left:0;right:0;top:0;height:1100px;background:${P.solid};filter:brightness(.8);clip-path:polygon(0 0,100% 0,100% 82%,0 100%)"></div>
    <div style="position:absolute;left:${tilt > 0 ? 260 : 80}px;width:740px;top:190px;height:740px">${ART()}</div>
    <div style="position:absolute;left:80px;right:80px;top:1140px">${kick()}<div style="height:22px"></div>${H1()}<div style="height:30px"></div>${B1()}</div>`,
  // G5. Wzór z kropek, mała ilustracja i karta z tekstem
  G5: () => `<div style="position:absolute;inset:0;background-image:radial-gradient(${P.ink}22 3px,transparent 4px);background-size:44px 44px"></div>
    <div style="position:absolute;left:330px;right:330px;top:200px;height:420px">${ART()}</div>
    <div style="position:absolute;left:80px;right:80px;top:690px;background:${spec.palette === 'cream' ? '#fff' : P.solid};padding:70px 60px;border-radius:28px;border-top:14px solid ${P.acc};box-shadow:0 30px 60px rgba(0,0,0,.35)">
      ${kick()}<div style="height:20px"></div>${H1()}<div style="height:30px"></div>${B1()}</div>`,
  // G6. Tekst u góry po lewej, wielka ilustracja wychodząca z prawego dolnego rogu
  G6: () => `<div style="position:absolute;right:-240px;bottom:-200px;width:1150px;height:1150px;opacity:.9">${ART()}</div>
    <div style="position:absolute;left:80px;right:110px;top:220px">${kick()}<div style="height:24px"></div>${H1('font-size:' + Math.round(hs * 1.05) + 'px')}<div style="height:36px"></div>${B1('max-width:820px')}</div>`,
  // G7. Gruba ramka, ilustracja w środku, tekst wyśrodkowany pod nią
  G7: () => `<div style="position:absolute;inset:200px 54px 230px;border:14px solid ${P.acc};border-radius:8px"></div>
    <div style="position:absolute;left:260px;right:260px;top:290px;height:560px">${ART()}</div>
    <div style="position:absolute;left:120px;right:120px;top:900px;text-align:center">${kick()}<div style="height:20px"></div>${H1()}<div style="height:30px"></div>${B1()}</div>`,
  // G8. Podział pionowy: panel w kolorze akcentu z ilustracją po lewej, tekst po prawej
  G8: () => `<div style="position:absolute;left:0;top:0;bottom:0;width:470px;background:${P.acc}"></div>
    <div style="position:absolute;left:35px;width:400px;top:740px;height:440px">${ART(CI)}</div>
    <div class="narrow" style="position:absolute;left:530px;right:56px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center">${kick()}<div style="height:22px"></div>${H1('font-size:' + Math.round(hs * (FT.fam === 'Play' ? 1 : .8)) + 'px')}<div style="height:40px"></div>${B1()}</div>`,
});
if (!L[spec.layout]) throw new Error('Nieznany layout ' + spec.layout);
const html = `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${L[spec.layout]()}${ctaHtml()}</body></html>`;
render(html, out, W, H).then(() => console.log('ok', out));
