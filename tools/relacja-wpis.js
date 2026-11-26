// Relacje z bloga (zasady Andrzeja 26.11.2026): bez strzałki; podtytuł jako pytanie do czytelnika; punkty jako polecenia, obrazowo; na dole cta: sprawdź na andrzejstaszczuk.pl/blog, pod nim wolne miejsce na naklejkę z linkiem (nazwa naklejki = tytuł wpisu). Pod adresem cta2 (Andrzej 26.11): Nie masz siły wpisać w przeglądarkę? To jak masz mieć siłę na zmianę? Pełna lista: relacje-marki/UWAGI-ANDRZEJA.md
// Relacja IG 1080x1920 zapowiadająca wpis na blogu (@psychologsportu).
// node relacja-wpis.js '{"kicker","t1","hl","t2","sub","items":[{"t","d"}],"cta"}' out.png
const path = require('path');
const { render } = require('./kit');
const F = p => 'file://' + path.join(__dirname, 'node_modules/@fontsource', p);
const font = ['400', '600', '700', '800'].map(w => `
@font-face{font-family:Pop;font-weight:${w};src:url(${F(`poppins/files/poppins-latin-ext-${w}-normal.woff2`)}) format('woff2');unicode-range:U+0100-024F}
@font-face{font-family:Pop;font-weight:${w};src:url(${F(`poppins/files/poppins-latin-${w}-normal.woff2`)}) format('woff2')}`).join('');
const Y = '#F4B63A', RED = '#C42332';
const esc = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
const o = JSON.parse(process.argv[2]);
const items = o.items.map((it, i) => `<div style="display:flex;gap:26px;align-items:flex-start;margin-top:${i ? 34 : 0}px">
  <div style="flex:none;width:64px;height:64px;border-radius:50%;background:${Y};color:#14161C;font:800 32px/64px Pop;text-align:center">${i + 1}</div>
  <div><div style="font:700 38px/1.25 Pop;color:#fff">${esc(it.t)}</div><div style="font:400 30px/1.4 Pop;color:rgba(255,255,255,.78);margin-top:6px">${esc(it.d)}</div></div></div>`).join('');
const html = `<!doctype html><html><head><meta charset="utf-8"><style>${font}*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1920px;overflow:hidden;font-family:Pop;color:#fff;background:radial-gradient(120% 60% at 50% 0%,#D32B3B 0%,${RED} 35%,#7E1222 100%);position:relative}</style></head><body>
<div style="position:absolute;inset:40px;border:6px solid ${Y};border-radius:40px"></div>
<svg style="position:absolute;right:-120px;top:-80px;opacity:.12" width="620" height="620" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="none" stroke="#fff" stroke-width="3"/><circle cx="50" cy="50" r="30" fill="none" stroke="#fff" stroke-width="3"/><circle cx="50" cy="50" r="14" fill="#fff"/></svg>
<div style="position:absolute;left:100px;right:100px;top:150px">
  <span style="display:inline-block;background:${Y};color:#14161C;font:800 32px Pop;letter-spacing:4px;padding:16px 36px;border-radius:999px">${esc(o.kicker)}</span>
  <div style="margin-top:${56+(+o.titleShift||0)}px;font:800 104px/1.08 Pop;letter-spacing:-1px">${esc(o.t1)}<span style="color:${Y}">${esc(o.hl)}</span>${esc(o.t2)}</div>
  <div style="margin-top:36px;font:600 40px/1.35 Pop;color:rgba(255,255,255,.9)">${esc(o.sub)}</div>
</div>
${items?`<div style="position:absolute;left:100px;right:100px;top:${o.itemsTop || 930}px;background:rgba(20,22,28,.55);border-radius:32px;padding:50px 50px">${items}</div>`:''}
${(o.cta||o.cta2)?`<div style="position:absolute;left:90px;right:90px;bottom:${+o.ctaBottom||250}px;text-align:center">${o.cta2?(()=>{const p=String(o.cta2).split(/(?<=\?)\s+/);return `<div style="font:700 38px/1.3 Pop;color:#fff">${esc(p[0])}</div>${p.length>1?`<div style="font:700 38px/1.3 Pop;color:${Y};margin-top:6px">${esc(p.slice(1).join(' '))}</div>`:''}`})():''}${o.cta?(()=>{const m=String(o.cta).match(/^(.*?\s)?(\S+\.\S+)$/);return `<div style="display:inline-block;margin-top:${o.cta2?30:0}px;background:${Y};color:#14161C;border-radius:999px;padding:18px 42px;font:600 34px Pop;box-shadow:0 10px 30px rgba(0,0,0,.25)">${m?`${esc(m[1]||'')}<b style="font-weight:800">${esc(m[2])}</b>`:esc(o.cta)}</div>`})():''}</div>`:''}
<div style="position:absolute;left:0;right:0;bottom:90px;text-align:center;font:700 30px Pop;letter-spacing:6px;opacity:.9">@PSYCHOLOGSPORTU</div>
</body></html>`;
render(html, process.argv[3], 1080, 1920).then(() => console.log('ok'));
